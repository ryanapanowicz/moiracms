import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Permission } from "../types";

export type CreatePermissionType = {
    __typename?: "Mutation";
    createPermission: {
        permission: Permission;
    };
};

export type CreatePermissionInput = {
    name: string;
};

export const CreatePermissionMutation = gql`
    mutation createPermission($name: String!) {
        createPermission(input: { name: $name }) {
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

const useCreatePermissionMutation = (
    options?: MutationHookOptions<CreatePermissionType, CreatePermissionInput>
) => {
    return useMutation<CreatePermissionType, CreatePermissionInput>(
        CreatePermissionMutation,
        options
    );
};

export default useCreatePermissionMutation;
