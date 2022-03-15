import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { Pagintator, PagintatorInput, User } from "../types";

export type UsersType = {
    users: {
        __typename?: "UserPaginator";
        paginatorInfo: Pagintator;
        data: [User];
    };
};

export const UsersQuery = gql`
    query users($order_by: [OrderByClause!], $first: Int = 10, $page: Int) {
        users(order_by: $order_by, first: $first, page: $page) {
            paginatorInfo {
                count
                currentPage
                firstItem
                hasMorePages
                lastItem
                lastPage
                perPage
                total
            }
            data {
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

const useUsersQuery = (
    options?: QueryHookOptions<UsersType, PagintatorInput>
) => {
    return useQuery<UsersType, PagintatorInput>(UsersQuery, options);
};

export const useUsersLazyQuery = (
    options?: QueryHookOptions<UsersType, PagintatorInput>
) => {
    return useLazyQuery<UsersType, PagintatorInput>(UsersQuery, options);
};

export default useUsersQuery;
