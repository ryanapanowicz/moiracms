import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Project } from "../types";

export type DeleteProjectType = {
    __typename?: "Mutation";
    deleteProject: {
        project: Project;
    };
};

export type DeleteProjectInput = {
    id: string;
};

export const DeleteProjectMutation = gql`
    mutation deleteProject($id: ID!) {
        deleteProject(id: $id) {
            project {
                id
                title
                slug
                content
                link
                built_with
                keywords
                description
                assets {
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
                user {
                    id
                    name
                    email
                    avatar
                }
                created_at
                updated_at
            }
        }
    }
`;

const useDeleteProjectMutation = (
    options?: MutationHookOptions<DeleteProjectType, DeleteProjectInput>
) => {
    return useMutation<DeleteProjectType, DeleteProjectInput>(
        DeleteProjectMutation,
        options
    );
};

export default useDeleteProjectMutation;
