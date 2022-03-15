import { Col, Form, Input, Row } from "antd";
import React from "react";

const PasswordInputs: React.FC = () => {
    return (
        <Row gutter={24}>
            <Col sm={24} md={12}>
                <Form.Item
                    name="password"
                    label="New Password"
                    rules={[
                        {
                            required: true,
                            message: "Password is required.",
                        },
                        {
                            min: 8,
                            message:
                                "The password must be at least 8 characters",
                        },
                    ]}
                >
                    <Input.Password visibilityToggle={true} />
                </Form.Item>
            </Col>
            <Col sm={24} md={12}>
                <Form.Item
                    name="password_confirmation"
                    label="New Password Confirmation"
                    rules={[
                        {
                            required: true,
                            message: "Password confirmation is required",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(
                                    new Error("Entered passwords do not match")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password visibilityToggle={true} />
                </Form.Item>
            </Col>
        </Row>
    );
};

export default PasswordInputs;
