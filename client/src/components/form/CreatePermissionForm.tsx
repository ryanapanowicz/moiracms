import { Col, Form, FormInstance, Input, Row } from "antd";
import React from "react";

export interface CreatePermissionFormProps {
    form?: FormInstance<any>;
    onFinish?: (values: any) => void;
}

const CreatePermissionForm: React.FC<CreatePermissionFormProps> = ({
    form,
    onFinish,
}) => {
    return (
        <Form
            form={form}
            name="create_permission_form"
            className="create-permission-form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
        >
            <Row>
                <Col span={24}>
                    <Form.Item
                        name="name"
                        label="Permission"
                        rules={[
                            {
                                required: true,
                                message: "Permission is required.",
                            },
                        ]}
                    >
                        <Input placeholder="e.g. edit users" autoFocus autoComplete="false" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default CreatePermissionForm;
