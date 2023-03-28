import { Breadcrumb, Button } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout, ProjectsTable } from "../components";
import { useProjectsQuery } from "../graphql";
import { useNotify } from "../hooks";
import { Can, PaginatorContext } from "../services";
import { formatError, getSorterVars } from "../utils";

const Projects: React.FC = () => {
    const { getVariables, setVariables } = useContext(PaginatorContext);
    const [paginate, setPaginate] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const notify = useNotify();

    const { data, error, loading, fetchMore } = useProjectsQuery({
        variables: getVariables("projects"),
    });

    const handleChange = ({ pageSize, current }: any, _: any, sorter: any) => {
        const variables: any = {
            first: pageSize,
            page: current,
            // Add order_by variables to GQL query
            ...getSorterVars(sorter),
        };
        setVariables("projects", variables);

        fetchMore({
            variables: variables,
        });
    };

    // Update pagination on data change
    useEffect(() => {
        if (data && "projects" in data) {
            const { currentPage, total, perPage, count } =
                data.projects.paginatorInfo;
            setPaginate({
                current: count <= 0 ? 1 : currentPage,
                pageSize: perPage,
                total: total,
            });
        }
    }, [data]);

    // Handle error notification for this page
    useEffect(() => {
        if (error) {
            notify.error({
                message: "Error",
                description: formatError(error),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    return (
        <PageLayout
            header={
                <>
                    <Breadcrumb className="page-title">
                        <Breadcrumb.Item key="content">Content</Breadcrumb.Item>
                        <Breadcrumb.Item key="content.projects">
                            Projects
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Can do="create" on="projects">
                        <div className="page-tools">
                            <Button type="primary">
                                <Link to="create">Create new Project</Link>
                            </Button>
                        </div>
                    </Can>
                </>
            }
        >
            <ProjectsTable
                dataSource={data?.projects.data}
                loading={loading}
                pagination={{ hideOnSinglePage: true, ...paginate }}
                onChange={handleChange}
            />
        </PageLayout>
    );
};

export default Projects;
