import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { Pagintator, PagintatorInput, Permission } from "../types";

export type PermissionsType = {
    permissions: {
        __typename?: "PermissionPaginator";
        paginatorInfo: Pagintator;
        data: [Permission];
    };
};

export const PermissionsQuery = gql`
    query permissions($order_by: [OrderByClause!], $first: Int = 10, $page: Int) {
        permissions(first: $first, page: $page, order_by: $order_by) {
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
                roles {
                    id
                    name
                }
            }
        }
    }
`;

const usePermissionsQuery = (
    options?: QueryHookOptions<PermissionsType, PagintatorInput>
) => {
    return useQuery<PermissionsType, PagintatorInput>(PermissionsQuery, options);
};

export const usePermissionsLazyQuery = (
    options?: QueryHookOptions<PermissionsType, PagintatorInput>
) => {
    return useLazyQuery<PermissionsType, PagintatorInput>(PermissionsQuery, options);
};

export default usePermissionsQuery;
