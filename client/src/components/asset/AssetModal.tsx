import { Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AssetModalContext, Editor, Uploader, Viewer } from ".";
import { notify } from "../../services";

export type AssetModalType = "view" | "upload" | "edit";

export interface GalleryArg {
    enabled: boolean;
    maxSelection: number | undefined;
}

export interface AssetModalProps {
    type?: AssetModalType;
    uid?: string;
    visible?: boolean;
    gallery?: GalleryArg | boolean;
    onSubmit?: (assets: any[]) => void;
    onClose?: () => void;
}

const modalDefaultWidth = 872;

const AssetModal: React.FC<AssetModalProps> = ({
    type = "upload",
    uid,
    visible = false,
    gallery = true,
    onSubmit,
    onClose,
}) => {
    const { showModal, hideModal } = useContext(AssetModalContext);
    const [isVisible, setIsVisible] = useState(visible);
    const [submitting, setSubmitting] = useState(false);
    const width = type === "view" ? 1200 : modalDefaultWidth;
    
    const showGallery =
        typeof gallery === "boolean" ? gallery : gallery.enabled;

    // If maxSelection is undefined selection amount is infinite
    const maxSelection =
        typeof gallery === "object" ? gallery.maxSelection : undefined;

    const handleCancel = () => {
        if (!submitting) {
            setIsVisible(false);
        }
    };

    const handleSubmit = (assets: any[]) => {
        typeof onSubmit === "function" && onSubmit(assets);
    };

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    return (
        <Modal
            className={`asset-modal asset-modal-${type}`}
            visible={isVisible}
            afterClose={onClose}
            onCancel={handleCancel}
            width={width}
            footer={false}
        >
            {
                {
                    upload: (
                        <Uploader
                            status={(working) => setSubmitting(working)}
                            showBackBtn={showGallery}
                            onBack={() => {
                                showModal({ type: "view" });
                            }}
                            onUpload={({ data }) => {
                                if (data?.upload) {
                                    notify.success({
                                        message: "Success",
                                        description: `Uploaded files successfully!`,
                                    });

                                    gallery
                                        ? showModal({ type: "view" })
                                        : hideModal();
                                }
                            }}
                            onCancel={handleCancel}
                        />
                    ),
                    edit: (
                        <Editor
                            uid={uid}
                            status={(working) => setSubmitting(working)}
                            showBackBtn={showGallery}
                            onBack={() => {
                                showModal({ type: "view" });
                            }}
                            onSave={({ data }) => {
                                if (data?.updateAssetInfo) {
                                    notify.success({
                                        message: "Success",
                                        description: `File ${data?.updateAssetInfo.asset.name} updated successfully!`,
                                    });

                                    gallery
                                        ? showModal({ type: "view" })
                                        : hideModal();
                                }
                            }}
                            onDelete={({ data }) => {
                                if (data?.deleteAsset) {
                                    notify.success({
                                        message: "Success",
                                        description: `File ${data?.deleteAsset.asset.name} deleted successfully!`,
                                    });

                                    gallery
                                        ? showModal({ type: "view" })
                                        : hideModal();
                                }
                            }}
                            onCancel={handleCancel}
                        />
                    ),
                    view: (
                        <Viewer
                            maxSelection={maxSelection}
                            onSubmit={handleSubmit}
                        />
                    ),
                }[type]
            }
        </Modal>
    );
};

export default AssetModal;
