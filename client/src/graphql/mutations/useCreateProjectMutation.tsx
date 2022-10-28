import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { Project } from "../types";

export type CreateProjectType = {
    __typename?: "Mutation";
    createProject: {
        project: Project;
    };
};

export type CreateProjectInput = {
    title: string;
    content: string;
    link: string;
    built_with: [string];
    keywords: [string];
    description: string;
    assets: [string];
};

export const CreateProjectMutation = gql`
    mutation createProject(
        $title: String!
        $content: String!
        $link: String
        $built_with: [String]
        $keywords: [String]
        $description: String
        $start: Date
        $end: Date
        $assets: [ID]
    ) {
        createProject(
            input: {
                title: $title
                content: $content
                link: $link
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
                slug
                content
                link
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

const useCreateProjectMutation = (
    options?: MutationHookOptions<CreateProjectType, CreateProjectInput>
) => {
    return useMutation<CreateProjectType, CreateProjectInput>(
        CreateProjectMutation,
        options
    );
};

export default useCreateProjectMutation;
