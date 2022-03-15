import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { Pagintator, PagintatorInput, Role } from "../types";

export type RolesType = {
    roles: {
        __typename?: "RolesPaginator";
        paginatorInfo: Pagintator;
        data: [Role];
    };
};

export const RolesQuery = gql`
    query roles($order_by: [OrderByClause!], $first: Int = 10, $page: Int) {
        roles(first: $first, page: $page, order_by: $order_by) {
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
                permissions {
                    id
                    name
                }
            }
        }
    }
`;

const useRolesQuery = (
    options?: QueryHookOptions<RolesType, PagintatorInput>
) => {
    return useQuery<RolesType, PagintatorInput>(RolesQuery, options);
};

export const useRolesLazyQuery = (
    options?: QueryHookOptions<RolesType, PagintatorInput>
) => {
    return useLazyQuery<RolesType, PagintatorInput>(RolesQuery, options);
};

export default useRolesQuery;
