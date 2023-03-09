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
    subtitle: string;
    content: string;
    featured?: string;
    link?: string;
    work_done?: string;
    built_with?: [string];
    keywords?: [string];
    description?: string;
    start?: string;
    end?: string;
    assets?: [string];
};

export const CreateProjectMutation = gql`
    mutation createProject(
        $title: String!
        $subtitle: String!
        $content: String!
        $featured: ID
        $link: String
        $work_done: String
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
                subtitle: $subtitle
                content: $content
                featured: $featured
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
                featured {
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

const useCreateProjectMutation = (
    options?: MutationHookOptions<CreateProjectType, CreateProjectInput>
) => {
    return useMutation<CreateProjectType, CreateProjectInput>(
        CreateProjectMutation,
        options
    );
};

export default useCreateProjectMutation;
