import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { AssetInfoInput, Media } from "../types";

export type UploadType = {
    __typename?: "Mutation";
    upload: Media[];
};

export type UploadInput = {
    ref_id: string;
    ref?: string;
    info?: AssetInfoInput;
    responsive?: boolean;
    files: File[];
};

export const UploadMutation = gql`
    mutation upload(
        $ref_id: ID!
        $ref: String
        $info: AssetInfoInput
        $responsive: Boolean = true
        $files: [Upload]!
    ) {
        upload(
            input: {
                ref_id: $ref_id
                ref: $ref
                info: $info
                responsive: $responsive
                files: $files
            }
        ) {
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

const useUploadMutation = (
    options?: MutationHookOptions<UploadType, UploadInput>
) => {
    return useMutation<UploadType, UploadInput>(UploadMutation, options);
};

export default useUploadMutation;
