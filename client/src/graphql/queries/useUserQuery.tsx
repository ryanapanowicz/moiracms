import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { User } from "../types";

export type UserType = {
    user: User;
};

export type UserInput = {
    id: string
};

export const UserQuery = gql`
    query user($id: ID) {
        user(id: $id) {
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
`;

const useUserQuery = (
    options?: QueryHookOptions<UserType, UserInput>
) => {
    return useQuery<UserType, UserInput>(UserQuery, options);
};

export const useUserLazyQuery = (
    options?: QueryHookOptions<UserType, UserInput>
) => {
    return useLazyQuery<UserType, UserInput>(UserQuery, options);
};

export default useUserQuery;
