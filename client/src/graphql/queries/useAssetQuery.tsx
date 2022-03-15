import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { Media } from "../types";

export type AssetType = {
    asset: Media;
};

export type AssetInput = {
    id: string;
};

export const AssetQuery = gql`
    query asset($id: ID) {
        asset(id: $id) {
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
`;

const useAssetQuery = (options?: QueryHookOptions<AssetType, AssetInput>) => {
    return useQuery<AssetType, AssetInput>(AssetQuery, options);
};

export const useAssetLazyQuery = (
    options?: QueryHookOptions<AssetType, AssetInput>
) => {
    return useLazyQuery<AssetType, AssetInput>(AssetQuery, options);
};

export default useAssetQuery;
