import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React from "react";
import { notify } from "../../services";

const { confirm } = Modal;

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
    const onClick: React.MouseEventHandler<HTMLElement> = (e) => {
        confirm({
            title: title,
            icon: "",
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
