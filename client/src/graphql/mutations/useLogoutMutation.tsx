import { gql, MutationHookOptions, useMutation } from "@apollo/client";

export type LogoutType = {
    __typename?: "Mutation";
    logout: {
        __typename?: "LogoutResponse";
        status: string;
        message: string;
    };
};

export const LogoutMutation = gql`
    mutation logout {
        logout {
            status
            message
        }
    }
`;

const useLogoutMutation = (options?: MutationHookOptions<LogoutType>) => {
    return useMutation<LogoutType>(LogoutMutation, options);
};

export default useLogoutMutation;
