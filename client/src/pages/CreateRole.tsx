import { Alert, Form, Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CreateRoleForm } from "../components/form";
import { useCreateRoleMutation } from "../graphql/mutations";
import { RolesQuery } from "../graphql/queries/useRolesQuery";
import { useNotify } from "../hooks";
import { PaginatorContext } from "../services";
import { formatError } from "../utils";

export interface CreateRoleProps {
    visible?: boolean;
    onClose?: () => void;
}

const CreateRole: React.FC<CreateRoleProps> = ({
    visible = false,
    onClose,
}) => {
    const { getVariables } = useContext(PaginatorContext);
    const [submitting, setSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [form] = Form.useForm();
    const notify = useNotify();

    const [createRole, { error }] = useCreateRoleMutation();

    const handleFinish = (values: any) => {
        if (!submitting) {
            setSubmitting(true);

            createRole({
                variables: values,
                refetchQueries: [
                    {
                        query: RolesQuery,
                        variables: getVariables("roles"),
                    },
                ],
            })
                .then(({ data }) => {
                    setSubmitting(false);

                    // Redirect success message on complete
                    if (data?.createRole.role) {
                        form.resetFields();

                        notify.success({
                            message: "Success",
                            description: `Role "${data?.createRole?.role.name}" successfully created!`,
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
            title="Create Role"
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
            <CreateRoleForm form={form} onFinish={handleFinish} />
        </Modal>
    );
};

export default CreateRole;
