import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { Pagintator, PagintatorInput, Media } from "../types";

export type AssetsType = {
    assets: {
        __typename?: "MediaPaginator";
        paginatorInfo: Pagintator;
        data: [Media];
    };
};

export const AssetsQuery = gql`
    query assets($order_by: [OrderByClause!], $first: Int = 12, $page: Int) {
        assets(first: $first, page: $page, order_by: $order_by) {
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
                file_name
                url
                preview
                responsive_images {
                    urls
                    base64svg
                }
                type
                extension
                mime_type
                size
                alternative_text
                caption
                created_at
                updated_at
            }
        }
    }
`;

const useAssetsQuery = (
    options?: QueryHookOptions<AssetsType, PagintatorInput>
) => {
    return useQuery<AssetsType, PagintatorInput>(AssetsQuery, options);
};

export const useAssetsLazyQuery = (
    options?: QueryHookOptions<AssetsType, PagintatorInput>
) => {
    return useLazyQuery<AssetsType, PagintatorInput>(AssetsQuery, options);
};

export default useAssetsQuery;
