import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { User } from "../types";

export type CreateUserType = {
    __typename?: "Mutation";
    createUser: {
        user: User;
    };
};

export type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    roles?: [string];
};

export const CreateUserMutation = gql`
    mutation createUser(
        $name: String!
        $email: String!
        $password: String!
        $password_confirmation: String!
        $roles: [String]
    ) {
        createUser(
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

const useCreateUserMutation = (
    options?: MutationHookOptions<CreateUserType, CreateUserInput>
) => {
    return useMutation<CreateUserType, CreateUserInput>(
        CreateUserMutation,
        options
    );
};

export default useCreateUserMutation;
