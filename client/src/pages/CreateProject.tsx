import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Space } from "antd";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreateProjectForm, PageLayout } from "../components";
import { useCreateProjectMutation } from "../graphql";
import { ProjectsQuery } from "../graphql/queries/useProjectsQuery";
import { useNotify } from "../hooks";
import { PaginatorContext } from "../services";
import { formatError } from "../utils";

const CreateProject: React.FC = () => {
    const { getVariables } = useContext(PaginatorContext);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const notify = useNotify();

    const [createProject, { error }] = useCreateProjectMutation();

    const handleFinish = (values: any) => {
        if (!submitting) {
            setSubmitting(true);

            const [start, end] = values.project_time || [];

            createProject({
                variables: {
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
                    if (data?.createProject.project) {
                        notify.success({
                            message: "Success",
                            description: `Project "${data.createProject.project.title}" successfully created!`,
                        });

                        navigate(`${data.createProject.project.id}`);
                    }
                })
                .catch(() => {
                    setSubmitting(false);
                });
        }
    };

    return (
        <PageLayout
            header={
                <>
                    <Space className="page-title" size="middle">
                        <Link to={-1 as any} className="back-link">
                            <ArrowLeftOutlined />
                        </Link>
                        <h2 className="title">Create Project</h2>
                    </Space>
                    <div className="page-tools">
                        <Button
                            form="create_project_form"
                            type="default"
                            key="reset"
                            htmlType="reset"
                        >
                            Reset
                        </Button>
                        <Button
                            form="create_project_form"
                            type="primary"
                            key="submit"
                            htmlType="submit"
                            loading={submitting}
                        >
                            Save
                        </Button>
                    </div>
                </>
            }
        >
            {error && (
                <Alert
                    message={formatError(error)}
                    type="error"
                    style={{ marginBottom: "24px" }}
                />
            )}
            <CreateProjectForm onFinish={handleFinish} />
        </PageLayout>
    );
};

export default CreateProject;
