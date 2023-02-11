import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useModal, useNotify } from "../../hooks";

export interface DeleteButtonProps {
    title?: string;
    content?: string;
    okText?: string;
    cancelText?: string;
    onClose?: () => Promise<any>;
    width?: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
    title,
    content,
    okText = "Delete",
    cancelText = "Cancel",
    onClose,
    width,
}) => {
    const modal = useModal();
    const notify = useNotify();

    const onClick: React.MouseEventHandler<HTMLElement> = (e) => {
        modal.confirm({
            title: title,
            icon: <></>,
            content: content,
            okText: cancelText,
            cancelText: okText,
            cancelButtonProps: { danger: true },
            width: width,
            async onCancel() {
                try {
                    onClose && onClose();
                } catch (e) {
                    return notify.error({
                        message: "Error",
                        description: "Cannot delete this item.",
                    });
                }
            },
        });
    };

    return <Button type="link" icon={<DeleteOutlined />} onClick={onClick} />;
};

export default DeleteButton;
