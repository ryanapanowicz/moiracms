import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Space } from "antd";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreateUserForm, PageLayout } from "../components";
import { useCreateUserMutation } from "../graphql";
import { UsersQuery } from "../graphql/queries/useUsersQuery";
import { useNotify } from "../hooks";
import { PaginatorContext } from "../services";
import { formatError } from "../utils";

const CreateUser: React.FC = () => {
    const { getVariables } = useContext(PaginatorContext);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const notify = useNotify();

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

                        navigate(`${data.createUser.user.id}`);
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
            <CreateUserForm onFinish={handleFinish} />
        </PageLayout>
    );
};

export default CreateUser;
