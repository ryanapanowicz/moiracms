import { Alert, Form, Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CreatePermissionForm } from "../components";
import { useCreatePermissionMutation } from "../graphql";
import { PermissionsQuery } from "../graphql/queries/usePermissionsQuery";
import { useNotify } from "../hooks";
import { PaginatorContext } from "../services";
import { formatError } from "../utils";

export interface CreatePermissionProps {
    visible?: boolean;
    onClose?: () => void;
}

const CreatePermission: React.FC<CreatePermissionProps> = ({
    visible = false,
    onClose,
}) => {
    const { getVariables } = useContext(PaginatorContext);
    const [submitting, setSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [form] = Form.useForm();
    const notify = useNotify();

    const [createPermission, { error }] = useCreatePermissionMutation();

    const handleFinish = (values: any) => {
        if (!submitting) {
            setSubmitting(true);

            createPermission({
                variables: values,
                refetchQueries: [
                    {
                        query: PermissionsQuery,
                        variables: getVariables("permissions"),
                    },
                ],
            })
                .then(({ data }) => {
                    setSubmitting(false);

                    // Redirect success message on complete
                    if (data?.createPermission.permission) {
                        form.resetFields();

                        notify.success({
                            message: "Success",
                            description: `Permission "${data?.createPermission?.permission.name}" successfully created!`,
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
            title="Create Permission"
            open={isVisible}
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
            <CreatePermissionForm form={form} onFinish={handleFinish} />
        </Modal>
    );
};

export default CreatePermission;
