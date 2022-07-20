import { Affix, Breadcrumb, Button, Layout } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectsTable } from "../components";
import { useProjectsQuery } from "../graphql";
import { Can, notify, PaginatorContext } from "../services";
import { formatError, getSorterVars } from "../utils";

const Projects: React.FC = () => {
    const { getVariables, setVariables } = useContext(PaginatorContext);
    const [paginate, setPaginate] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

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
    }, [error]);

    return (
        <Layout className="page">
            <Affix className="header-affix">
                <Layout.Header className="page-header">
                    <Breadcrumb className="page-title">
                        <Breadcrumb.Item key="content">Content</Breadcrumb.Item>
                        <Breadcrumb.Item key="content.projects">
                            Projects
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Can do="create" on="projects">
                        <div className="page-tools">
                            <Button type="primary">
                                <Link to="create">
                                    Create new Project
                                </Link>
                            </Button>
                        </div>
                    </Can>
                </Layout.Header>
            </Affix>
            <Layout.Content className="page-content">
                <ProjectsTable
                    dataSource={data?.projects.data}
                    loading={loading}
                    pagination={{ hideOnSinglePage: true, ...paginate }}
                    onChange={handleChange}
                />
            </Layout.Content>
        </Layout>
    );
};

export default Projects;
