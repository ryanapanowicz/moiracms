import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { User } from "../types";

export type UpdateProfileType = {
    __typename?: "Mutation";
    updateUser: {
        user: User;
    };
};

export type UpdateProfileInput = {
    id: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    avatar: string;
};

export const UpdateUserMutation = gql`
    mutation updateUser(
        $id: ID!
        $name: String!
        $email: String!
        $password: String
        $password_confirmation: String
        $avatar: String
    ) {
        updateUser(
            id: $id
            input: {
                name: $name
                email: $email
                password: $password
                password_confirmation: $password_confirmation
                avatar: $avatar
            }
        ) {
            user {
                id
                name
                email
                avatar
            }
        }
    }
`;

const useUpdateProfileMutation = (
    options?: MutationHookOptions<UpdateProfileType, UpdateProfileInput>
) => {
    return useMutation<UpdateProfileType, UpdateProfileInput>(
        UpdateUserMutation,
        options
    );
};

export default useUpdateProfileMutation;
