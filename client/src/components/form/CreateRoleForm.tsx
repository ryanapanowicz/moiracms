import { Col, Form, FormInstance, Input, Row } from "antd";
import React from "react";

export interface CreateRoleFormProps {
    form?: FormInstance<any>;
    onFinish?: (values: any) => void;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ form, onFinish }) => {
    return (
        <Form
            form={form}
            name="create_role_form"
            className="create-role-form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
        >
            <Row>
                <Col span={24}>
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
                        <Input placeholder="e.g. Admin" autoFocus autoComplete="false" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default CreateRoleForm;
