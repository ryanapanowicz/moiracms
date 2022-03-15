import { gql, MutationHookOptions, useMutation } from "@apollo/client";

export type ResetPasswordType = {
    __typename?: "Mutation";
    resetPassword: {
        __typename?: "ForgotPasswordResponse";
        status: string;
        message: string;
    };
};

export type ResetPasswordInput = {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
};

export const ResetPasswordMutation = gql`
    mutation resetPassword(
        $email: String!
        $token: String!
        $password: String!
        $password_confirmation: String!
    ) {
        resetPassword(
            input: {
                email: $email
                token: $token
                password: $password
                password_confirmation: $password_confirmation
            }
        ) {
            status
            message
        }
    }
`;

const useResetPasswordMutation = (
    options?: MutationHookOptions<ResetPasswordType, ResetPasswordInput>
) => {
    return useMutation<ResetPasswordType, ResetPasswordInput>(
        ResetPasswordMutation,
        options
    );
};

export default useResetPasswordMutation;
