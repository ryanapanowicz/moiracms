import { DownOutlined, EyeOutlined, FormOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Affix, Breadcrumb, Button, Col, Dropdown, Layout, Row } from "antd";
import type { SelectEventHandler } from "rc-menu/lib/interface";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    AdminLayout,
    AssetList,
    AssetModalContext,
    SortOrderMenu,
} from "../components";
import { sortOrderData } from "../components/form/SortOrderMenu";
import { useAssetsQuery } from "../graphql";
import { Can, History, PaginatorContext } from "../services";
import { AbilityContext } from "../services/Can";

const defaultSortOrder = sortOrderData[0];
const defaultVariables = { first: 24, order_by: [defaultSortOrder.order] };

interface AssetsParams {
    uid: string;
}

const Assets: React.FC = () => {
    const { getVariables, setVariables } = useContext(PaginatorContext);
    const { showModal } = useContext(AssetModalContext);
    const ability = useAbility(AbilityContext);
    const [paginate, setPaginate] = useState({
        current: 1,
        pageSize: 24,
        total: 0,
    });
    const { uid } = useParams<AssetsParams>();

    // If no query args set use defaults
    useEffect(() => {
        if (!Object.keys(getVariables("assets")).length) {
            setVariables("assets", defaultVariables);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        uid && showAssetModal("edit");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid]);

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

    const handleAssetClick = (file: any) => {
        History.push(`/assets/${file.id}`);
    };

    const handleSortOrder: SelectEventHandler = ({ key }) => {
        const sort = sortOrderData.find((item) => item.key === key);
        if (sort) {
            const variables: any = { order_by: [sort.order] };
            setVariables("assets", { ...getVariables("assets"), ...variables });
            refetch(variables);
        }
    };

    const showAssetModal = (type?: any) => {
        showModal({
            type: type,
            uid: uid,
            gallery: false,
            onClose: hideAssetModal,
        });
    };

    const hideAssetModal = () => {
        // Remove asset uid from url on close
        if (uid) {
            History.push("/assets");
        }
    };

    // Update pagination on data change
    useEffect(() => {
        if (data && "assets" in data) {
            const { currentPage, total, perPage, count } =
                data.assets.paginatorInfo;
            setPaginate({
                current: count <= 0 ? 0 : currentPage,
                pageSize: perPage,
                total: total,
            });
        }
    }, [data]);

    return (
        <AdminLayout>
            <Layout className="page-layout">
                <Layout className="page">
                    <Affix className="header-affix">
                        <Layout.Header className="page-header">
                            <div className="page-title">
                                <Breadcrumb className="title">
                                    <Breadcrumb.Item key="assets">
                                        Media Assets
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <Dropdown
                                    overlay={
                                        <SortOrderMenu
                                            selectable={true}
                                            onSelect={handleSortOrder}
                                            defaultSelectedKeys={[
                                                sortOrder.key,
                                            ]}
                                        />
                                    }
                                    trigger={["click"]}
                                >
                                    <Button>
                                        Sort order
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </div>
                            <Can do="upload" on="assets">
                                <div className="page-tools">
                                    <Button
                                        type="primary"
                                        onClick={() => showAssetModal()}
                                    >
                                        Upload Assets
                                    </Button>
                                </div>
                            </Can>
                        </Layout.Header>
                    </Affix>
                    <Layout.Content className="page-content">
                        <Row>
                            <Col span={24}>
                                <AssetList
                                    dataSource={data?.assets.data}
                                    loading={loading}
                                    pagination={paginate}
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
                                    onChange={handleChange}
                                    onAssetClick={handleAssetClick}
                                    onBtnClick={
                                        ability.can("upload", "assets")
                                            ? () => {
                                                  showAssetModal();
                                              }
                                            : undefined
                                    }
                                />
                            </Col>
                        </Row>
                    </Layout.Content>
                </Layout>
            </Layout>
        </AdminLayout>
    );
};

export default Assets;
