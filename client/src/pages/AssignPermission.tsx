import { Alert, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { AssignPermissionForm } from "../components/form";
import { useAssignPermissionToRoleMutation } from "../graphql";
import { MeQuery } from "../graphql/queries/useMeQuery";
import { RoleQuery } from "../graphql/queries/useRoleQuery";
import { Role } from "../graphql/types";
import { notify } from "../services";
import { formatError } from "../utils";

export interface AssignPermissionProps {
    role: Role;
    visible?: boolean;
    onClose?: () => void;
}

const AssignPermission: React.FC<AssignPermissionProps> = ({
    role,
    visible = false,
    onClose,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [form] = Form.useForm();

    const [assignPermissionToRole, { error }] =
        useAssignPermissionToRoleMutation();

    const handleFinish = (values: any) => {
        if (!submitting) {
            setSubmitting(true);

            assignPermissionToRole({
                variables: { role: role.name, ...values },
                refetchQueries: [
                    {
                        query: MeQuery,
                    },
                    {
                        query: RoleQuery,
                        variables: { id: role.id },
                    },
                ],
            })
                .then(({ data }) => {
                    setSubmitting(false);

                    // Redirect success message on complete
                    if (data?.assignPermissionToRole.role) {
                        form.resetFields();

                        notify.success({
                            message: "Success",
                            description: `Permissions successfully added to "${data?.assignPermissionToRole?.role.name}"!`,
                        });

                        setIsVisible(false);
                    }
                })
                .catch(() => {
                    setSubmitting(false);
                });
        }
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        if (!submitting) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    return (
        <Modal
            title="Assign Permission"
            visible={isVisible}
            afterClose={onClose}
            onCancel={handleCancel}
            onOk={handleOk}
            okText="Save"
            cancelButtonProps={{ disabled: submitting }}
            okButtonProps={{ loading: submitting }}
        >
            {error && (
                <Alert
                    message={formatError(error)}
                    type="error"
                    style={{ marginBottom: "24px" }}
                />
            )}
            <AssignPermissionForm
                role={role}
                form={form}
                onFinish={handleFinish}
            />
        </Modal>
    );
};

export default AssignPermission;
