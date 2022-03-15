import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Role } from "../types";

export type AssignPermissionToRoleType = {
    __typename?: "Mutation";
    assignPermissionToRole: {
        role: Role;
    };
};

export type AssignPermissionToRoleInput = {
    role: string;
    permission: string[];
};

export const AssignPermissionToRoleMutation = gql`
    mutation assignPermissionToRole($role: String!, $permission: [String!]!) {
        assignPermissionToRole(input: { role: $role, permission: $permission }) {
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

const useAssignPermissionToRoleMutation = (
    options?: MutationHookOptions<AssignPermissionToRoleType, AssignPermissionToRoleInput>
) => {
    return useMutation<AssignPermissionToRoleType, AssignPermissionToRoleInput>(
        AssignPermissionToRoleMutation,
        options
    );
};

export default useAssignPermissionToRoleMutation;
