import { gql, MutationHookOptions, useMutation } from "@apollo/client";

export type LoginType = {
    __typename?: "Mutation";
    login: {
        __typename?: "AuthPayload";
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
    };
};

export type LoginInput = {
    username: string;
    password: string;
};

export const loginMutation = gql`
    mutation login($username: String!, $password: String!) {
        login(input: { username: $username, password: $password }) {
            access_token
            refresh_token
            expires_in
            token_type
        }
    }
`;

const useLoginMutation = (
    options?: MutationHookOptions<LoginType, LoginInput>
) => {
    return useMutation<LoginType, LoginInput>(loginMutation, options);
};

export default useLoginMutation;
