import { DeleteOutlined, EyeOutlined, FormOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Button, ConfigProvider, List } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AssetModalContext, FilePreview } from "..";
import { Media } from "../../graphql/types";
import { AbilityContext } from "../../services/Can";

export interface AssetInputProps {
    value?: Media[];
    onChange?: (changeValue: any) => void;
    maxSelection?: number;
}

const AssetInput: React.FC<AssetInputProps> = ({
    value,
    onChange,
    maxSelection,
}) => {
    const { showModal, hideModal } = useContext(AssetModalContext);
    const ability = useAbility(AbilityContext);
    const [assets, setAssets] = useState(value);

    useEffect(() => {
        const newAssetIds = assets ? assets.map((value: any) => value.id) : [];
        onChange?.([...newAssetIds]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assets]);

    const handleClick = () => {
        showModal({
            type: "view",
            gallery: { enabled: true, maxSelection: maxSelection },
            onSubmit: (selected) => {
                if (selected.length) {
                    const updatedAssets = assets
                        ? [...assets, ...selected]
                        : [...selected];

                    setAssets(updatedAssets);
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

    const handleDelete = (index: number) => {
        const updatedAssets = assets
            ? assets.filter((_, ind) => ind !== index)
            : [];
        setAssets(updatedAssets);
    };

    return (
        <ConfigProvider renderEmpty={() => <></>}>
            <Button type="primary" onClick={handleClick}>
                Add Assets
            </Button>
            <List
                className="asset-input"
                grid={{
                    gutter: 32,
                    column: 6,
                }}
                dataSource={assets}
                renderItem={(asset, index) => (
                    <List.Item
                        onClick={() => {
                            handleEdit(asset);
                        }}
                    >
                        <FilePreview
                            file={asset}
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
                                handleDelete(index);
                            }}
                        />
                    </List.Item>
                )}
            />
        </ConfigProvider>
    );
};

export default AssetInput;
