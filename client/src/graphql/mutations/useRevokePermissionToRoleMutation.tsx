import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Role } from "../types";

export type RevokePermissionToRoleType = {
    __typename?: "Mutation";
    revokePermissionToRole: {
        role: Role;
    };
};

export type RevokePermissionToRoleInput = {
    role: string;
    permission: string[];
};

export const RevokePermissionToRoleMutation = gql`
    mutation revokePermissionToRole($role: String!, $permission: [String!]!) {
        revokePermissionToRole(input: { role: $role, permission: $permission }) {
            role {
                id
                name
                permissions {
                    id
                    name
                }
            }
        }
    }
`;

const useRevokePermissionToRoleMutation = (
    options?: MutationHookOptions<RevokePermissionToRoleType, RevokePermissionToRoleInput>
) => {
    return useMutation<RevokePermissionToRoleType, RevokePermissionToRoleInput>(
        RevokePermissionToRoleMutation,
        options
    );
};

export default useRevokePermissionToRoleMutation;
