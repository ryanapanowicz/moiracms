import { gql, MutationHookOptions, useMutation } from "@apollo/client";

export type ForgotPasswordType = {
    __typename?: "Mutation";
    forgotPassword: {
        __typename?: "ForgotPasswordResponse";
        status: string;
        message: string;
    };
};

export type ForgotPasswordInput = {
    email: string;
};

export const ForgotPasswordMutation = gql`
    mutation forgotPassword($email: String!) {
        forgotPassword(input: { email: $email }) {
            status
            message
        }
    }
`;

const useForgotPasswordMutation = (
    options?: MutationHookOptions<ForgotPasswordType, ForgotPasswordInput>
) => {
    return useMutation<ForgotPasswordType, ForgotPasswordInput>(
        ForgotPasswordMutation,
        options
    );
};

export default useForgotPasswordMutation;
