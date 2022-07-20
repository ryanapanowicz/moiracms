import { Affix, Alert, Button, Form, Layout } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AdminLayout, ProfileForm } from "../components";
import { useUpdateProfileMutation } from "../graphql";
import { MeQuery, MeType } from "../graphql/queries/useMeQuery";
import { notify, UserContext } from "../services";
import { formatError, getInitials } from "../utils";
import type { UserDataType } from "./UpdateUser";

const Profile: React.FC = () => {
    const { user } = useContext(UserContext);

    const [submitting, setSubmitting] = useState(false);
    const [userData, setUserData] = useState<UserDataType>();
    const [toggle, setToggle] = useState(false);
    const [form] = Form.useForm();

    const [updateProfile, { error }] = useUpdateProfileMutation();

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.me.name,
                email: user.me.email,
                avatar: user.me.avatar,
            });
        } else {
            // Handle when couldn't find the user
            setUserData(null);
        }
    }, [user]);
    
    const handleFinish = (values: any) => {
        if (!submitting && user) {
            setSubmitting(true);

            updateProfile({
                variables: { id: user.me.id, ...values },
                update: (cache, { data }) => {
                    const me = cache.readQuery<MeType>({
                        query: MeQuery,
                    })?.me;

                    if (data) {
                        // update the cache with new data
                        cache.writeQuery({
                            query: MeQuery,
                            data: {
                                me: {
                                    ...me,
                                    name: data.updateUser.user.name,
                                    email: data.updateUser.user.email,
                                    avatar: data.updateUser.user.avatar,
                                },
                            },
                            variables: { id: data?.updateUser.user.id },
                        });
                    }
                },
            })
                .then(({ data }) => {
                    setSubmitting(false);

                    // Redirect success message on complete
                    if (data?.updateUser.user) {
                        // Reset form password values
                        form.resetFields(['password', 'password_confirmation']);
                        setToggle(false);

                        notify.success({
                            message: "Success",
                            description: `Profile successfully updated!`,
                        });
                    }
                })
                .catch(() => setSubmitting(false));
        }
    };

    if (!userData) {
        return <></>;
    }

    return (
        <AdminLayout>
            <Layout className="page">
                <Affix className="header-affix">
                    <Layout.Header className="page-header">
                        <h2 className="page-title">Update {userData.name}</h2>
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
                    <ProfileForm
                        form={form}
                        onFinish={handleFinish}
                        initialValues={userData}
                        imageTitle={getInitials(userData.name)}
                        passwordToggle={toggle}
                        onToggleChange={(checked) => setToggle(checked)}
                    />
                </Layout.Content>
            </Layout>
        </AdminLayout>
    );
};

export default Profile;
