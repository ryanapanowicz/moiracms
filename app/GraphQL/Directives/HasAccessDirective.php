<?php

namespace App\GraphQL\Directives;

use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use App\Exceptions\AuthorizationException;
use Illuminate\Contracts\Auth\Authenticatable;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;

class HasAccessDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return /** @lang GraphQL */<<<'GRAPHQL'
"""
Limit field access to users that have permission or role.
"""
directive @hasAccess(
    """
    The name of the role authorized users need to have.
    """
    role: String

    """
    The name of the permissions authorized users need to have.
    """
    permission: String

    """
    The field name to compare to the logged in user with.
    """
    field: String

    """
    Does owner of model have override access.
    """
    owner: Boolean = false

    """
    The relationship to check ownership.
    Mutually exclusive with the `model` argument.
    """
    relation: String

    """
    Specify the class name of the model to use.
    This is only needed when the default model detection does not work.
    """
    model: String
) repeatable on FIELD_DEFINITION
GRAPHQL;
    }

    protected $user;

    public function handleField(
        FieldValue $fieldValue,
        Closure $next
    ): FieldValue
    {
        $previousResolver = $fieldValue->getResolver();

        $fieldValue->setResolver(function ($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($previousResolver) {
            $this->user = $context->user();

            // Handle Roles and Permissions checks for input types
            $this->doArgAccessChecks($resolveInfo);

            // Handle Roles and Permissions checks for field definition
            $this->doAccessChecks($this, $resolveInfo);

            return $previousResolver($root, $args, $context, $resolveInfo);
        });

        return $next($fieldValue);
    }

    protected function doAccessChecks(
        BaseDirective $directive,
        ResolveInfo $resolveInfo
    ): void
    {
        $roles = $directive->directiveArgValue("role");
        $permissions = $directive->directiveArgValue("permission");
        $ownerAccess = $directive->directiveArgValue("owner", false);
        $fieldName = $directive->directiveArgValue("field", "user_id");

        if (!$this->user) {
            throw new AuthorizationException("Unauthenticated.", "You need to be logged in to access.");
        }

        // Skip other validation checks if the user owns
        // the model and ownership override is enabled.
        if ($this->hasOwnership($ownerAccess, $fieldName, $resolveInfo)) {
            return;
        }

        if (
            !$this->checkRoles($roles) ||
            !$this->checkPermissions($permissions)
        ) {
            throw new AuthorizationException(
                "Authorization exception",
                "You are not authorized to access {$this->nodeName()}"
            );
        }
    }

    protected function doArgAccessChecks(ResolveInfo $resolveInfo): void
    {
        foreach ($resolveInfo->argumentSet->arguments as $key => $argument) {
            $filteredDirectives = $argument->directives->filter(function ($object): bool {
                return $object instanceof ArgAccessDirective;
            });

            if ($filteredDirectives->count() > 0) {
                foreach ($filteredDirectives as $directive) {
                    $this->doAccessChecks($directive, $resolveInfo);
                }
            }
        }
    }

    protected function hasOwnership(
        bool $isOwner,
        string $fieldName,
        ResolveInfo $resolveInfo
    ): bool
    {
        if (!$isOwner) {
            return false;
        }

        $relation = $this->directiveArgValue('relation');
        $valid = false;

        $models = $resolveInfo->argumentSet
            ->enhanceBuilder($this->getModelClass()::query(), [])
            ->get();

        foreach ($models as $model) {
            if ($relation) {
                $model = $model->$relation;
            }

            // is model is user use id instead of fieldname
            if ($model instanceof Authenticatable) {
                $fieldName = "id";
            }

            $valid = true;

            // Exit on first invalid permission
            if ($model->{$fieldName} !== $this->user->id) {
                return false;
            }
        }

        return $valid;
    }

    protected function checkRoles($roles): bool
    {
        return is_null($roles) || $this->user->hasRole($roles);
    }

    protected function checkPermissions($permissions): bool
    {
        return is_null($permissions) ||
            $this->user->hasAllPermissions($permissions);
    }
}