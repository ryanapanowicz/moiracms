import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Media } from "../types";

export type DeleteAssetType = {
    __typename?: "Mutation";
    deleteAsset: {
        asset: Media;
    };
};

export type DeleteAssetInput = {
    id: string;
};

export const DeleteAssetMutation = gql`
    mutation deleteAsset($id: ID!) {
        deleteAsset(id: $id) {
            asset {
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

const useDeleteAssetMutation = (
    options?: MutationHookOptions<DeleteAssetType, DeleteAssetInput>
) => {
    return useMutation<DeleteAssetType, DeleteAssetInput>(
        DeleteAssetMutation,
        options
    );
};

export default useDeleteAssetMutation;
