import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import React, { useState } from "react";
import { useRolesQuery } from "../../graphql";

export interface CreateUserFormProps {
    form?: FormInstance<any>;
    onFinish?: (values: any) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ form, onFinish }) => {
    const [options, setOptions] = useState([{ value: "" }]);

    // Get data for Role select field
    const { loading } = useRolesQuery({
        onCompleted: ({ roles }) => {
            const list = roles.data.map(({ name }) => ({ value: name }));
            setOptions(list);
        },
    });

    return (
        <Form
            form={form}
            name="create_user_form"
            className="create-user-form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
        >
            <Row>
                <Col>
                    <h2 className="form-title">Details</h2>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col sm={24} md={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Name is required.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="e.g. Jordan Walke"
                            autoFocus
                            autoComplete="false"
                        />
                    </Form.Item>
                </Col>
                <Col sm={24} md={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                type: "email",
                                message: "Email address must be valid",
                            },
                            {
                                required: true,
                                message: "Email address is required.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="e.g. jordan.walke@moiracms.io"
                            autoComplete="false"
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col sm={24} md={12}>
                    <Form.Item
                        name="password"
                        label="Password"
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
                        label="Password Confirmation"
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
                                        new Error(
                                            "Entered passwords do not match"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password visibilityToggle={true} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2 className="form-title">Roles</h2>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name="roles">
                        <Select
                            mode="multiple"
                            placeholder="Select Role"
                            options={options}
                            loading={loading}
                            showArrow
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default CreateUserForm;
