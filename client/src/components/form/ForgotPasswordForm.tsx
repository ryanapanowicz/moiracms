import { grey } from "@ant-design/colors";
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input } from "antd";
import React from "react";

export interface ForgotPasswordProps {
    form?: FormInstance<any>;
    onFinish?: (values: any) => void;
    loading?: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordProps> = ({
    form,
    onFinish,
    loading,
}) => {
    return (
        <Form
            form={form}
            name="forgot_password"
            className="forgot-password-form"
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
            <Form.Item>
                <Button
                    block
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                >
                    Request password reset
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ForgotPasswordForm;
