import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Role } from "../types";

export type DeleteRoleType = {
    __typename?: "Mutation";
    deleteRole: {
        role: Role;
    };
};

export type DeleteRoleInput = {
    id: string;
};

export const DeleteRoleMutation = gql`
    mutation deleteRole($id: ID!) {
        deleteRole(id: $id) {
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

const useDeleteRoleMutation = (
    options?: MutationHookOptions<DeleteRoleType, DeleteRoleInput>
) => {
    return useMutation<DeleteRoleType, DeleteRoleInput>(
        DeleteRoleMutation,
        options
    );
};

export default useDeleteRoleMutation;
