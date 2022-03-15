import { ArrowLeftOutlined } from "@ant-design/icons";
import { Affix, Alert, Button, Layout, Space } from "antd";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CreateProjectForm } from "../components";
import { useCreateProjectMutation } from "../graphql";
import { ProjectsQuery } from "../graphql/queries/useProjectsQuery";
import { History, notify, PaginatorContext } from "../services";
import { formatError } from "../utils";

const CreateProject: React.FC = () => {
    const { getVariables } = useContext(PaginatorContext);
    const [submitting, setSubmitting] = useState(false);

    const [createProject, { error }] = useCreateProjectMutation();

    const handleFinish = (values: any) => {
        if (!submitting) {
            setSubmitting(true);

            createProject({
                variables: values,
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

                        History.push({
                            pathname: `./${data.createProject.project.id}`,
                        });
                    }
                })
                .catch(() => {
                    setSubmitting(false);
                });
        }
    };

    return (
        <Layout className="page">
            <Affix className="header-affix">
                <Layout.Header className="page-header">
                    <Space className="page-title" size="middle">
                        <Link to="." className="back-link">
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
                </Layout.Header>
            </Affix>
            <Layout.Content className="page-content">
                {error && (
                    <Alert
                        message={formatError(error)}
                        type="error"
                        style={{ marginBottom: "24px" }}
                    />
                )}
                <CreateProjectForm onFinish={handleFinish} />
            </Layout.Content>
        </Layout>
    );
};

export default CreateProject;
