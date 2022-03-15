import { ArrowLeftOutlined } from "@ant-design/icons";
import { Affix, Alert, Button, Form, Layout, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ServerError } from ".";
import { UpdateUserForm } from "../components";
import { useUpdateUserMutation, useUserQuery } from "../graphql";
import { MeQuery } from "../graphql/queries/useMeQuery";
import { RolesQuery } from "../graphql/queries/useRolesQuery";
import { Can, notify, PaginatorContext, UserContext } from "../services";
import { formatError } from "../utils";

export type UserDataType = {
    name: string;
    email: string;
    avatar?: string;
    roles?: string[];
} | null;

export interface UserParams {
    id: string;
}

const UpdateUser: React.FC = () => {
    const { getVariables } = useContext(PaginatorContext);
    const { user } = useContext(UserContext);
    const { id } = useParams<UserParams>();

    const [submitting, setSubmitting] = useState(false);
    const [userData, setUserData] = useState<UserDataType>();

    const [form] = Form.useForm();
    const [toggle, setToggle] = useState(false);

    const [updateUser, { error: updateError }] = useUpdateUserMutation();

    const { error: userError } = useUserQuery({
        variables: { id: id },
        onCompleted: ({ user }) => {
            if (user) {
                setUserData({
                    name: user.name,
                    email: user.email,
                    roles: user.roles?.map((perm) => perm["name"]),
                });
            } else {
                // Handle when couldn't find the user
                setUserData(null);
            }
        },
    });

    const handleFinish = (values: any) => {
        if (!submitting) {
            setSubmitting(true);

            updateUser({
                variables: { id: id, ...values },
                refetchQueries: () => {
                    let queries: any[] = [
                        {
                            query: RolesQuery,
                            variables: getVariables("roles"),
                        },
                    ];

                    // Update AuthUser if updated
                    if (user && user.me.id === id) {
                        queries.push({
                            query: MeQuery,
                        });
                    }

                    return queries;
                },
            })
                .then(({ data }) => {
                    setSubmitting(false);

                    // Redirect success message on complete
                    if (data?.updateUser.user) {
                        // Reset form values
                        form.resetFields();
                        setToggle(false);

                        notify.success({
                            message: "Success",
                            description: `User "${data.updateUser.user.name}" successfully updated!`,
                        });
                    }
                })
                .catch(() => setSubmitting(false));
        }
    };

    // Handle error notification for this page
    useEffect(() => {
        if (userError) {
            notify.error({
                message: "Error",
                description: formatError(userError),
            });
        }
    }, [userError]);

    // Render error page if no User was found
    if (userData === null) {
        return <ServerError />;
    }

    if (!userData) {
        return <></>;
    }

    return (
        <Layout className="page">
            <Affix className="header-affix">
                <Layout.Header className="page-header">
                    <Space className="page-title" size="middle">
                        <Link to="." className="back-link">
                            <ArrowLeftOutlined />
                        </Link>
                        <h2 className="page-title">Update {userData.name}</h2>
                    </Space>
                    <Can do="edit" on="users">
                        <div className="page-tools">
                            <Button
                                form="update_user_form"
                                type="default"
                                key="reset"
                                htmlType="reset"
                            >
                                Reset
                            </Button>
                            <Button
                                form="update_user_form"
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
                <UpdateUserForm
                    form={form}
                    onFinish={handleFinish}
                    initialValues={userData}
                    passwordToggle={toggle}
                    onToggleChange={(checked) => setToggle(checked)}
                />
            </Layout.Content>
        </Layout>
    );
};

export default UpdateUser;
