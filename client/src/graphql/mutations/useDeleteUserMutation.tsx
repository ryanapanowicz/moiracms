import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { User } from "../types";

export type DeleteUserType = {
    __typename?: "Mutation";
    deleteUser: {
        user: User;
    };
};

export type DeleteUserInput = {
    id: string;
};

export const DeleteUserMutation = gql`
    mutation deleteUser(
        $id: ID!
    ) {
        deleteUser(
            id: $id
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

const useDeleteUserMutation = (
    options?: MutationHookOptions<DeleteUserType, DeleteUserInput>
) => {
    return useMutation<DeleteUserType, DeleteUserInput>(
        DeleteUserMutation,
        options
    );
};

export default useDeleteUserMutation;
