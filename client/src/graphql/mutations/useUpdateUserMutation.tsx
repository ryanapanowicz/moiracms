import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { User } from "../types";

export type UpdateUserType = {
    __typename?: "Mutation";
    updateUser: {
        user: User;
    };
};

export type UpdateUserInput = {
    id: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    roles?: [string];
};

export const UpdateUserMutation = gql`
    mutation updateUser(
        $id: ID!
        $name: String!
        $email: String!
        $password: String
        $password_confirmation: String
        $roles: [String]
    ) {
        updateUser(
            id: $id
            input: {
                name: $name
                email: $email
                password: $password
                password_confirmation: $password_confirmation
                roles: $roles
            }
        ) {
            user {
                id
                name
                email
                avatar
                roles {
                    id
                    name
                    permissions {
                        id
                        name
                    }
                }
            }
        }
    }
`;

const useUpdateUserMutation = (
    options?: MutationHookOptions<UpdateUserType, UpdateUserInput>
) => {
    return useMutation<UpdateUserType, UpdateUserInput>(
        UpdateUserMutation,
        options
    );
};

export default useUpdateUserMutation;
