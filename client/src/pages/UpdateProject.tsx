import { ArrowLeftOutlined } from "@ant-design/icons";
import { Affix, Alert, Button, Layout, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ServerError } from ".";
import { UpdateProjectForm } from "../components";
import { useProjectQuery, useUpdateProjectMutation } from "../graphql";
import { ProjectsQuery } from "../graphql/queries/useProjectsQuery";
import { Can, notify, PaginatorContext } from "../services";
import { formatError } from "../utils";

const UpdateProject: React.FC = () => {
    const { getVariables } = useContext(PaginatorContext);
    const [submitting, setSubmitting] = useState(false);
    const [projectData, setProjectData] = useState<any>();
    const { id } = useParams();

    const [updateProject, { error: updateError }] = useUpdateProjectMutation();

    const { error: projectError } = useProjectQuery({
        variables: id ? { id: id } : undefined,
        onCompleted: ({ project }) => {
            if (project) {
                // Filter out null values from Project
                const filteredProject = Object.fromEntries(
                    Object.entries(project).filter(([_, v]) => v)
                );
                setProjectData(filteredProject);
            } else {
                setProjectData(null);
            }
        },
    });

    const handleFinish = (values: any) => {
        if (!submitting) {
            setSubmitting(true);

            updateProject({
                variables: { id: id, ...values },
                refetchQueries: [
                    {
                        query: ProjectsQuery,
                        variables: getVariables("projects"),
                    },
                ],
            })
                .then(({ data }) => {
                    setSubmitting(false);

                    // Redirect success message on complete
                    if (data?.updateProject.project) {
                        notify.success({
                            message: "Success",
                            description: `Project "${data.updateProject.project.title}" successfully updated!`,
                        });
                    }
                })
                .catch(() => {
                    setSubmitting(false);
                });
        }
    };

    // Handle error notification for this page
    useEffect(() => {
        if (projectError) {
            notify.error({
                message: "Error",
                description: formatError(projectError),
            });
        }
    }, [projectError]);

    // Render error page if no User was found
    if (projectData === null) {
        return <ServerError />;
    }

    if (!projectData) {
        return <></>;
    }
    
    return (
        <Layout className="page">
            <Affix className="header-affix">
                <Layout.Header className="page-header">
                    <Space className="page-title" size="middle">
                        <Link to={-1 as any} className="back-link">
                            <ArrowLeftOutlined />
                        </Link>
                        <h2 className="page-title">
                            Update {projectData.title}
                        </h2>
                    </Space>
                    <Can do="edit" on="projects">
                        <div className="page-tools">
                            <Button
                                form="update_project_form"
                                type="default"
                                key="reset"
                                htmlType="reset"
                            >
                                Reset
                            </Button>
                            <Button
                                form="update_project_form"
                                type="primary"
                                key="submit"
                                htmlType="submit"
                                loading={submitting}
                            >
                                Save
                            </Button>
                        </div>
                    </Can>
                </Layout.Header>
            </Affix>
            <Layout.Content className="page-content">
                {updateError && (
                    <Alert
                        message={formatError(updateError)}
                        type="error"
                        style={{ marginBottom: "24px" }}
                    />
                )}
                <UpdateProjectForm
                    onFinish={handleFinish}
                    initialValues={projectData}
                />
            </Layout.Content>
        </Layout>
    );
};

export default UpdateProject;
