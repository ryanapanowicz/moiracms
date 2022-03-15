import { Col, Form, FormInstance, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { usePermissionsQuery } from "../../graphql";
import { Role } from "../../graphql/types";

export interface AssignPermissionFormProps {
    role: Role;
    form?: FormInstance<any>;
    onFinish?: (values: any) => void;
}

const AssignPermissionForm: React.FC<AssignPermissionFormProps> = ({
    role,
    form,
    onFinish,
}) => {
    const [options, setOptions] = useState([{ value: "" }]);

    // Get data for Role select field
    const { data, loading } = usePermissionsQuery({
        variables: { first: 9999 },
        fetchPolicy: "no-cache",
        onCompleted: ({ permissions }) => {
            const list = permissions.data.map(({ name }) => {
                return { value: name };
            });
            setOptions(list);
        },
    });

    // Remove permissions that are already attached to the role
    // Update filtered results when the role permissions data changes
    useEffect(() => {
        if (data) {
            const filteredOptions = data.permissions.data.flatMap(({ name }) => {
                if (role.permissions.find((perm) => perm.name === name)) return [];
                return { value: name };
            });

            setOptions(filteredOptions);
        }

    }, [data, role.permissions]);

    return (
        <Form
            form={form}
            name="assign_permission_form"
            className="assign-permission-form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
        >
            <Row>
                <Col span={24}>
                    <Form.Item
                        name="permission"
                        label="Permission"
                        rules={[
                            {
                                required: true,
                                message: "Permission is required.",
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select Permissions"
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

export default AssignPermissionForm;
