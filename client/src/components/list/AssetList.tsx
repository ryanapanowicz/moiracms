import { ConfigProvider, List } from "antd";
import { ListGridType } from "antd/lib/list";
import React from "react";
import { FilePreview, RenderEmpty } from "..";

export type AssetListProps = {
    grid?: ListGridType;
    dataSource?: any[];
    loading?: boolean;
    pagination?: any;
    selected?: any[];
    overlay?: boolean;
    overlayTitle?: React.ReactNode;
    btnText?: string;
    onChange?: (page: number, pageSize?: number | undefined) => void;
    onAssetClick?: (file: any) => void;
    onBtnClick?: () => void;
};

const AssetList: React.FC<AssetListProps> = ({
    grid,
    dataSource,
    loading,
    pagination,
    selected = [],
    overlay = false,
    overlayTitle,
    onChange,
    onAssetClick,
    onBtnClick,
}) => {
    const handleItemClick = (file: any) => {
        typeof onAssetClick === "function" && onAssetClick(file);
    };

    const itemClassName = (file: any): string => {
        let classNames: string[] = [];

        // Add selected class
        selected.forEach(
            (item) => item?.id === file?.id && classNames.push("asset-selected")
        );

        return classNames.join(" ");
    };

    return (
        <ConfigProvider
            renderEmpty={() =>
                onBtnClick ? (
                    <RenderEmpty
                        content="No assets yet"
                        btnText="Upload Assets"
                        onClick={onBtnClick}
                    />
                ) : (
                    <RenderEmpty content="No assets yet" />
                )
            }
        >
            <List
                className="asset-gallery"
                grid={
                    grid || {
                        gutter: 32,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 6,
                        xxl: 6,
                    }
                }
                dataSource={dataSource}
                loading={loading}
                pagination={{
                    hideOnSinglePage: true,
                    onChange: onChange,
                    ...pagination,
                }}
                renderItem={(file) => (
                    <List.Item
                        onClick={() => {
                            handleItemClick(file);
                        }}
                    >
                        <FilePreview
                            file={file}
                            className={itemClassName(file)}
                            overlay={overlay}
                            overlayTitle={overlayTitle}
                        />
                    </List.Item>
                )}
            />
        </ConfigProvider>
    );
};

export default AssetList;
