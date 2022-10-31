import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Project } from "../types";

export type UpdateProjectType = {
    __typename?: "Mutation";
    updateProject: {
        project: Project;
    };
};

export type UpdateProjectInput = {
    id: string;
    title: string;
    content: string;
    link: string;
    built_with: [string];
    keywords: [string];
    description: string;
    assets: [string];
};

export const UpdateProjectMutation = gql`
    mutation updateProject(
        $id: ID!
        $title: String!
        $subtitle: String!
        $slug: String!
        $content: String!
        $link: String
        $work_done: String
        $built_with: [String]
        $keywords: [String]
        $description: String
        $start: Date
        $end: Date
        $assets: [ID]
    ) {
        updateProject(
            id: $id
            input: {
                title: $title
                subtitle: $subtitle
                slug: $slug
                content: $content
                link: $link
                work_done: $work_done
                built_with: $built_with
                keywords: $keywords
                description: $description
                start: $start
                end: $end
                assets: $assets
            }
        ) {
            project {
                id
                title
                subtitle
                slug
                content
                link
                work_done
                built_with
                keywords
                description
                start
                end
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

const useUpdateProjectMutation = (
    options?: MutationHookOptions<UpdateProjectType, UpdateProjectInput>
) => {
    return useMutation<UpdateProjectType, UpdateProjectInput>(
        UpdateProjectMutation,
        options
    );
};

export default useUpdateProjectMutation;
