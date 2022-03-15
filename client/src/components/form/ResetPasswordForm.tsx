import { grey } from "@ant-design/colors";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input } from "antd";
import React from "react";

export interface ResetPasswordProps {
    form?: FormInstance<any>;
    onFinish?: (values: any) => void;
    loading?: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordProps> = ({
    form,
    onFinish,
    loading,
}) => {
    return (
        <Form
            form={form}
            name="reset_password"
            className="reset-password-form"
            onFinish={onFinish}
        >
            <Form.Item
                name="email"
                rules={[
                    {
                        type: "email",
                        message: "Email address must be valid",
                    },
                    {
                        required: true,
                        message: "Email address is required",
                    },
                ]}
            >
                <Input
                    size="large"
                    prefix={<UserOutlined style={{ color: grey[0] }} />}
                    placeholder="email address"
                    autoFocus
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    { required: true, message: "Password is required" },
                    {
                        min: 8,
                        message: "The password must be at least 8 characters",
                    },
                ]}
            >
                <Input.Password
                    size="large"
                    prefix={<LockOutlined style={{ color: grey[0] }} />}
                    placeholder="password"
                    visibilityToggle={true}
                />
            </Form.Item>
            <Form.Item
                name="password_confirmation"
                dependencies={["password"]}
                rules={[
                    {
                        required: true,
                        message: "Password confirmation is required",
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject(
                                new Error("Entered passwords do not match")
                            );
                        },
                    }),
                ]}
            >
                <Input.Password
                    size="large"
                    prefix={<LockOutlined style={{ color: grey[0] }} />}
                    placeholder="password confirmation"
                    visibilityToggle={true}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    block
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                >
                    Reset Password
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ResetPasswordForm;
