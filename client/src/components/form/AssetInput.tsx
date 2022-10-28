import {
    DeleteOutlined,
    DragOutlined,
    EyeOutlined,
    FormOutlined
} from "@ant-design/icons";
import { useAbility } from "@casl/react";
import {
    closestCenter,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext
} from "@dnd-kit/sortable";
import { Button, ConfigProvider, List } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AssetModalContext, FilePreview } from "..";
import { Media } from "../../graphql/types";
import { AbilityContext } from "../../services/Can";
import SortableItem, { SortableHandle } from "../list/SortableItem";

export interface AssetInputProps {
    value?: Media[];
    onChange?: (changeValue: any) => void;
    maxSelection?: number;
}

interface AssetType extends Media {
    key: string | number;
}

type AssetArray = AssetType[] | undefined;

const uniqueKeys = (value: Media[] | undefined): AssetArray => {
    return value
        ? value.map((val, idx) => ({
              ...val,
              key: Math.random().toString(16).slice(2),
          }))
        : [];
};

const AssetInput: React.FC<AssetInputProps> = ({
    value,
    onChange,
    maxSelection,
}) => {
    const { showModal, hideModal } = useContext(AssetModalContext);
    const ability = useAbility(AbilityContext);

    // Decorate Dedia[] type with key for SortableContext
    const [assets, setAssets] = useState(uniqueKeys(value));
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        onChange?.(assets ? assets.map((value: any) => value.id) : []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assets]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setAssets((items) => {
                if (items) {
                    const oldIndex = items.findIndex(
                        (item) => item.key === active.id
                    );
                    const newIndex = items.findIndex(
                        (item) => item.key === over.id
                    );

                    return arrayMove(items, oldIndex, newIndex);
                }
            });
        }
    };

    const handleClick = () => {
        showModal({
            type: "view",
            gallery: {
                enabled: true,
                maxSelection: maxSelection,
            },
            onSubmit: (selected) => {
                if (selected.length) {
                    setAssets(
                        uniqueKeys(
                            assets ? [...assets, ...selected] : [...selected]
                        )
                    );
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
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={assets ? assets.map((value) => value.key) : []}
                    strategy={rectSortingStrategy}
                >
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
                            <SortableItem
                                key={asset.key}
                                id={asset.key}
                                hasHandle={true}
                            >
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
                                    <SortableHandle id={asset.key}>
                                        <Button
                                            className="draggable-handle"
                                            shape="circle"
                                            icon={<DragOutlined />}
                                        />
                                    </SortableHandle>
                                </List.Item>
                            </SortableItem>
                        )}
                    />
                </SortableContext>
            </DndContext>
        </ConfigProvider>
    );
};

export default AssetInput;
