import { DownOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Button, Col, Row, Space } from "antd";
import type { SelectEventHandler } from "rc-menu/lib/interface";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AssetList, AssetModalContext, SortOrderMenu } from "..";
import { useAssetsQuery } from "../../graphql";
import { Can, PaginatorContext } from "../../services";
import { AbilityContext } from "../../services/Can";
import { sortOrderData } from "../form/SortOrderMenu";

export interface ViewerProps {
    maxSelection?: number | string;
    onSubmit?: (assets: any[]) => void;
}

const defaultSortOrder = sortOrderData[0];
const defaultVariables = { first: 24, order_by: [defaultSortOrder.order] };

const Viewer: React.FC<ViewerProps> = ({ maxSelection, onSubmit }) => {
    const { getVariables, setVariables } = useContext(PaginatorContext);
    const { showModal } = useContext(AssetModalContext);
    const ability = useAbility(AbilityContext);

    const [selected, setSelected] = useState<any[]>([]);
    const paginate = {
        current: 1,
        pageSize: 24,
        total: 0,
    };

    // If no query args set use defaults
    useEffect(() => {
        if (!Object.keys(getVariables("assets")).length) {
            setVariables("assets", defaultVariables);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Set default selected item for sortOrder dropdown
    const sortOrder = useMemo(
        () =>
            sortOrderData.find((item) => {
                // Compare query sort order object to sortOrderData
                // to find the correct key for the sortOrder Dropdown
                const orderBy = getVariables("assets")["order_by"];
                if (orderBy) {
                    return (
                        Object.entries(item.order).toString() ===
                        Object.entries(orderBy[0]).toString()
                    );
                }
                return false;
            }) || defaultSortOrder,
        [getVariables]
    );

    // Run query for Assets using last run query vars or defaults if not set
    const { data, loading, refetch, fetchMore } = useAssetsQuery({
        variables: Object.keys(getVariables("assets")).length
            ? getVariables("assets")
            : defaultVariables,
    });

    // Update pagination on data change
    if (data && "assets" in data) {
        const { currentPage, total, perPage, count } =
            data.assets.paginatorInfo;

        Object.assign(paginate, {
            current: count <= 0 ? 0 : currentPage,
            pageSize: perPage,
            total: total,
        });
    }

    const handleChange = (page: number, pageSize?: number | undefined) => {
        const variables = {
            ...getVariables("assets"),
            first: pageSize,
            page: page,
        };

        setVariables("assets", variables);

        fetchMore({
            variables: variables,
        });
    };

    const handleSortOrder: SelectEventHandler = ({ key }) => {
        const sort = sortOrderData.find((item) => item.key === key);
        if (sort) {
            const variables: any = { order_by: [sort.order] };
            setVariables("assets", { ...getVariables("assets"), ...variables });
            refetch(variables);
        }
    };

    const handleUploadBtn = () => {
        showModal({ type: "upload" });
    };

    const handleSubmit = () => {
        typeof onSubmit === "function" && onSubmit(selected);
    };

    const handleAssetClick = (file: any) => {
        if (selected.find((item) => item.id === file.id)) {
            setSelected(selected.filter((item) => item.id !== file.id));
        } else {
            // Skip if over max selection of assets
            if (maxSelection && selected.length >= Number(maxSelection)) {
                return;
            }

            setSelected([...selected, file]);
        }
    };

    return (
        <>
            <div className="ant-modal-header">
                <div className="ant-modal-title">Media Assets</div>
            </div>
            <div className="asset-modal-content">
                <div className="asset-list-header">
                    <Row justify="space-between">
                        <Col>
                            <SortOrderMenu
                                onSelect={handleSortOrder}
                                defaultSelectedKeys={[sortOrder.key]}
                            >
                                <Button>
                                    Sort order
                                    <DownOutlined />
                                </Button>
                            </SortOrderMenu>
                        </Col>
                        <Can do="upload" on="assets">
                            <Col>
                                <Space>
                                    <Button onClick={handleUploadBtn}>
                                        Upload Assets
                                    </Button>
                                </Space>
                            </Col>
                        </Can>
                    </Row>
                </div>
                <div className="asset-list-content">
                    <Row>
                        <Col span={24}>
                            <AssetList
                                dataSource={data?.assets.data}
                                selected={selected}
                                loading={loading}
                                pagination={paginate}
                                overlay={true}
                                onAssetClick={handleAssetClick}
                                onBtnClick={
                                    ability.can("upload", "assets")
                                        ? handleUploadBtn
                                        : undefined
                                }
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="ant-modal-footer">
                <Button type="primary" onClick={handleSubmit}>
                    Add Assets
                </Button>
            </div>
        </>
    );
};

export default Viewer;
