<?php

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Schema\Directives\BaseDirective;

class ArgAccessDirective extends BaseDirective
{
    public static function definition(): string
    {
        return
            /** @lang GraphQL */
            <<<'GRAPHQL'
            """
Limit input access to users that have permission or role.
"""
directive @argAccess(
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
) repeatable on INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
GRAPHQL;
    }
}
