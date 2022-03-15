import { grey } from "@ant-design/colors";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export interface LoginProps {
    form?: FormInstance<any>;
    onFinish?: (values: any) => void;
    loading?: boolean;
}

const LoginForm: React.FC<LoginProps> = ({ form, onFinish, loading }) => {
    return (
        <Form
            name="login"
            className="login-form"
            form={form}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
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
                rules={[{ required: true, message: "Password is required" }]}
            >
                <Input.Password
                    size="large"
                    prefix={<LockOutlined style={{ color: grey[0] }} />}
                    placeholder="password"
                    visibilityToggle={true}
                />
            </Form.Item>
            <Form.Item>
                <Link to="/password/forgot">Forgot your password?</Link>
            </Form.Item>
            <Form.Item>
                <Button
                    block
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                >
                    Sign In
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
