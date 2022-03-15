import { gql, MutationHookOptions, useMutation } from "@apollo/client";

export enum RegisterStatus {
    MUST_VERIFY_EMAIL,
    SUCCESS,
}

export type RegisterType = {
    __typename?: "Mutation";
    register: {
        __typename?: "RegisterResponse";
        tokens: {
            __typename?: "AuthPayload";
            access_token: string;
            refresh_token: string;
            expires_in: number;
            token_type: string;
        };
        status: RegisterStatus;
    };
};

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export const RegisterMutation = gql`
    mutation register(
        $name: String!
        $email: String!
        $password: String!
        $password_confirmation: String!
    ) {
        register(
            input: {
                name: $name
                email: $email
                password: $password
                password_confirmation: $password_confirmation
            }
        ) {
            tokens {
                access_token
                refresh_token
                expires_in
                token_type
            }
            status
        }
    }
`;

const useRegisterMutation = (
    options?: MutationHookOptions<RegisterType, RegisterInput>
) => {
    return useMutation<RegisterType, RegisterInput>(RegisterMutation, options);
};

export default useRegisterMutation;
