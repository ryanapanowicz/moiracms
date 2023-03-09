import { DeleteOutlined, EyeOutlined, FormOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Button, ConfigProvider, List } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AssetModalContext, FilePreview } from "..";
import { Media } from "../../graphql/types";
import { AbilityContext } from "../../services/Can";

export interface ImageInputProps {
    value?: Media;
    onChange?: (changeValue: any) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ value, onChange }) => {
    const { showModal, hideModal } = useContext(AssetModalContext);
    const ability = useAbility(AbilityContext);

    // Decorate Dedia type with key for SortableContext
    const [image, setImage] = useState(value);

    useEffect(() => {
        onChange?.(image ? image.id : undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image]);

    const handleClick = () => {
        showModal({
            type: "view",
            gallery: {
                enabled: true,
                maxSelection: 1,
            },
            onSubmit: (selected) => {
                if (selected.length) {
                    setImage(selected.shift());
                    hideModal();
                }
            },
        });
    };

    const handleEdit = (asset: Media) => {
        showModal({
            type: "edit",
            uid: asset.id,
            gallery: false,
        });
    };

    const handleDelete = () => {
        setImage(undefined);
    };

    return (
        <ConfigProvider
            theme={{ token: { padding: 0 } }}
            renderEmpty={() => <></>}
        >
            <Button
                type="primary"
                onClick={handleClick}
                style={{ marginBottom: 30 }}
            >
                Add Image
            </Button>
            <List
                className="asset-input"
                grid={{
                    gutter: 32,
                    column: 4,
                }}
                dataSource={image && [image]}
                renderItem={(img) => (
                    <List.Item
                        onClick={() => {
                            handleEdit(img);
                        }}
                    >
                        <FilePreview
                            file={img}
                            overlay={true}
                            overlayTitle={
                                ability.can("edit", "assets") ? (
                                    <>
                                        <FormOutlined />
                                        Edit
                                    </>
                                ) : (
                                    <>
                                        <EyeOutlined />
                                        View
                                    </>
                                )
                            }
                        />
                        <Button
                            className="asset-input-remove"
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                        />
                    </List.Item>
                )}
            />
        </ConfigProvider>
    );
};

export default ImageInput;
