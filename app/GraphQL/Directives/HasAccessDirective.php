<?php

namespace App\GraphQL\Directives;

use App\Exceptions\AuthorizationException;
use Nuwave\Lighthouse\Execution\ResolveInfo;
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
    ): void {
        $fieldValue->wrapResolver(fn(callable $resolver): \Closure => function (mixed $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($resolver) {
            $this->user = $context->user();

            // Handle Roles and Permissions checks for input types
            $this->doArgAccessChecks(
                $root,
                $args,
                $context,
                $resolveInfo
            );

            // Handle Roles and Permissions checks for field definition
            $this->doAccessChecks(
                $this,
                $root,
                $args,
                $context,
                $resolveInfo
            );

            return $resolver($root, $args, $context, $resolveInfo);
        });

    }

    protected function doAccessChecks(BaseDirective $directive, mixed $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): void
    {
        $roles = $directive->directiveArgValue("role");
        $permissions = $directive->directiveArgValue("permission");

        if (!$this->user) {
            throw new AuthorizationException("Unauthenticated.", "You need to be logged in to access.");
        }

        // Skip other validation checks if the user owns
        // the model and ownership override is enabled.
        if (
            $this->hasOwnership(
                $root,
                $args,
                $context,
                $resolveInfo
            )
        ) {
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

    protected function doArgAccessChecks(mixed $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): void
    {
        foreach ($resolveInfo->argumentSet->arguments as $argument) {
            $filteredDirectives = $argument->directives->filter(function ($object): bool {
                return $object instanceof ArgAccessDirective;
            });

            if ($filteredDirectives->count() > 0) {
                foreach ($filteredDirectives as $directive) {
                    $this->doAccessChecks(
                        $directive,
                        $root,
                        $args,
                        $context,
                        $resolveInfo
                    );
                }
            }
        }
    }

    protected function hasOwnership(mixed $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        $ownerAccess = $this->directiveArgValue("owner", false);
        $fieldName = $this->directiveArgValue("field", "user_id");

        if (!$ownerAccess) {
            return false;
        }

        $relation = $this->directiveArgValue('relation');
        $valid = false;

        $models = $resolveInfo
            ->enhanceBuilder(
                $this->getModelClass()::query(),
                [],
                $root,
                $args,
                $context,
                $resolveInfo,
            )
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