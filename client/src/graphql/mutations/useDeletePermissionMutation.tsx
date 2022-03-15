import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Permission } from "../types";

export type DeletePermissionType = {
    __typename?: "Mutation";
    deletePermission: {
        permission: Permission;
    };
};

export type DeletePermissionInput = {
    id: string;
};

export const DeletePermissionMutation = gql`
    mutation deletePermission($id: ID!) {
        deletePermission(id: $id) {
            permission {
                id
                name
                roles {
                    id
                    name
                }
            }
        }
    }
`;

const useDeletePermissionMutation = (
    options?: MutationHookOptions<DeletePermissionType, DeletePermissionInput>
) => {
    return useMutation<DeletePermissionType, DeletePermissionInput>(
        DeletePermissionMutation,
        options
    );
};

export default useDeletePermissionMutation;
