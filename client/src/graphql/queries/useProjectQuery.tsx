import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { Project } from "../types";

export type ProjectType = {
    project: Project;
};

export type ProjectInput = {
    id: string;
};

export const ProjectQuery = gql`
    query project($id: ID) {
        project(id: $id) {
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
`;

const useProjectQuery = (
    options?: QueryHookOptions<ProjectType, ProjectInput>
) => {
    return useQuery<ProjectType, ProjectInput>(ProjectQuery, options);
};

export const useProjectLazyQuery = (
    options?: QueryHookOptions<ProjectType, ProjectInput>
) => {
    return useLazyQuery<ProjectType, ProjectInput>(ProjectQuery, options);
};

export default useProjectQuery;
