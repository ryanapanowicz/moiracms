import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { AssetInfoInput, Media } from "../types";

export type UpdateAssetInfoType = {
    __typename?: "Mutation";
    updateAssetInfo: {
        asset: Media;
    };
};

export type UpdateAssetInfoInput = {
    id: string;
    info: AssetInfoInput;
};

export const UpdateAssetInfoMutation = gql`
    mutation updateAssetInfo(
        $id: ID!
        $name: String
        $alternative_text: String
        $caption: String
    ) {
        updateAssetInfo(
            id: $id
            input: {
                name: $name
                alternative_text: $alternative_text
                caption: $caption
            }
        ) {
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

const useUpdateAssetInfoMutation = (
    options?: MutationHookOptions<UpdateAssetInfoType, UpdateAssetInfoInput>
) => {
    return useMutation<UpdateAssetInfoType, UpdateAssetInfoInput>(
        UpdateAssetInfoMutation,
        options
    );
};

export default useUpdateAssetInfoMutation;
