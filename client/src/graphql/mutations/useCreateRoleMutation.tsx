import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Role } from "../types";

export type CreateRoleType = {
    __typename?: "Mutation";
    createRole: {
        role: Role;
    };
};

export type CreateRoleInput = {
    name: string;
};

export const CreateRoleMutation = gql`
    mutation createRole($name: String!) {
        createRole(input: { name: $name }) {
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

const useCreateRoleMutation = (
    options?: MutationHookOptions<CreateRoleType, CreateRoleInput>
) => {
    return useMutation<CreateRoleType, CreateRoleInput>(
        CreateRoleMutation,
        options
    );
};

export default useCreateRoleMutation;
