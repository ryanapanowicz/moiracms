import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { Pagintator, PagintatorInput, Project } from "../types";

export type ProjectsType = {
    projects: {
        __typename?: "ProjectPaginator";
        paginatorInfo: Pagintator;
        data: [Project];
    };
};

export const ProjectsQuery = gql`
    query projects($order_by: [OrderByClause!], $first: Int = 10, $page: Int) {
        projects(order_by: $order_by, first: $first, page: $page) {
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

const useProjectsQuery = (
    options?: QueryHookOptions<ProjectsType, PagintatorInput>
) => {
    return useQuery<ProjectsType, PagintatorInput>(ProjectsQuery, options);
};

export const useProjectsLazyQuery = (
    options?: QueryHookOptions<ProjectsType, PagintatorInput>
) => {
    return useLazyQuery<ProjectsType, PagintatorInput>(ProjectsQuery, options);
};

export default useProjectsQuery;
