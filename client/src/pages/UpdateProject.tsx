import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ServerError } from ".";
import { PageLayout, UpdateProjectForm } from "../components";
import { useProjectQuery, useUpdateProjectMutation } from "../graphql";
import { ProjectsQuery } from "../graphql/queries/useProjectsQuery";
import { useNotify } from "../hooks";
import { Can, PaginatorContext } from "../services";
import { formatError } from "../utils";

const UpdateProject: React.FC = () => {
    const { getVariables } = useContext(PaginatorContext);
    const [submitting, setSubmitting] = useState(false);
    const [projectData, setProjectData] = useState<any>();
    const { id } = useParams();
    const notify = useNotify();

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

            const [start, end] = values.project_time || [];

            updateProject({
                variables: {
                    id: id,
                    ...values,
                    start: start ? start.format("YYYY-MM-DD") : null,
                    end: end ? end.format("YYYY-MM-DD") : null,
                },
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
        <PageLayout
            header={
                <>
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
                </>
            }
        >
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
        </PageLayout>
    );
};

export default UpdateProject;
