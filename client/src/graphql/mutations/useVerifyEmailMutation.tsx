import { gql, MutationHookOptions, useMutation } from "@apollo/client";

export type VerifyEmailType = {
    __typename: "Mutation";
    verifyEmail: {
        __typename: "AuthPayload";
        access_token: string;
        refresh_token: string;
        expires_in: string;
        token_type: string;
    };
};

export type VerifyEmailInput = {
    token: string;
};

export const VerifyEmailMutation = gql`
    mutation verifyEmail($token: String!) {
        verifyEmail(input: { token: $token }) {
            access_token
            refresh_token
            expires_in
            token_type
        }
    }
`;

const useVerifyEmailMutation = (
    options?: MutationHookOptions<VerifyEmailType, VerifyEmailInput>
) => {
    return useMutation<VerifyEmailType, VerifyEmailInput>(
        VerifyEmailMutation,
        options
    );
};

export default useVerifyEmailMutation;
