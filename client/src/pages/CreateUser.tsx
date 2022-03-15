import { ArrowLeftOutlined } from "@ant-design/icons";
import { Affix, Alert, Button, Layout, Space } from "antd";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CreateUserForm } from "../components";
import { useCreateUserMutation } from "../graphql";
import { UsersQuery } from "../graphql/queries/useUsersQuery";
import { History, notify, PaginatorContext } from "../services";
import { formatError } from "../utils";

const CreateUser: React.FC = () => {
    const { getVariables } = useContext(PaginatorContext);
    const [submitting, setSubmitting] = useState(false);

    const [createUser, { error }] = useCreateUserMutation();

    const handleFinish = (values: any) => {
        if (!submitting) {
            setSubmitting(true);

            createUser({
                variables: values,
                refetchQueries: [
                    { query: UsersQuery, variables: getVariables("users") },
                ],
            })
                .then(({ data }) => {
                    setSubmitting(false);

                    // Redirect success message on complete
                    if (data?.createUser.user) {
                        notify.success({
                            message: "Success",
                            description: `User "${data.createUser.user.name}" successfully created!`,
                        });

                        History.push({
                            pathname: `./${data.createUser.user.id}`,
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
                        <h2 className="title">Create User</h2>
                    </Space>
                    <div className="page-tools">
                        <Button
                            form="create_user_form"
                            type="default"
                            key="reset"
                            htmlType="reset"
                        >
                            Reset
                        </Button>
                        <Button
                            form="create_user_form"
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
                <CreateUserForm onFinish={handleFinish} />
            </Layout.Content>
        </Layout>
    );
};

export default CreateUser;
