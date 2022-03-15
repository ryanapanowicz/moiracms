import { Affix, Breadcrumb, Button, Col, Layout, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CreatePermission } from ".";
import { PermissionsList } from "../components";
import { usePermissionsQuery } from "../graphql";
import { Can, notify, PaginatorContext } from "../services";
import { formatError } from "../utils";

const Permissions: React.FC = () => {
    const { getVariables, setVariables } = useContext(PaginatorContext);
    const [visible, setVisible] = useState(false);
    const [paginate, setPaginate] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const { data, loading, error, fetchMore } = usePermissionsQuery({
        variables: getVariables("permissions"),
    });

    const handleChange = (page: number, pageSize?: number | undefined) => {
        const variables: any = {
            first: pageSize,
            page: page,
        };
        setVariables("permissions", variables);

        fetchMore({
            variables: variables,
        });
    };

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    // Update pagination on data change
    useEffect(() => {
        if (data && "permissions" in data) {
            const { currentPage, total, perPage, count } =
                data.permissions.paginatorInfo;
            setPaginate({
                current: count <= 0 ? 1 : currentPage,
                pageSize: perPage,
                total: total,
            });
        }
    }, [data]);

    // Handle error notification for this page
    useEffect(() => {
        if (error) {
            notify.error({
                message: "Error",
                description: formatError(error),
            });
        }
    }, [error]);

    return (
        <Layout className="page">
            <Affix className="header-affix">
                <Layout.Header className="page-header">
                    <Breadcrumb className="page-title">
                        <Breadcrumb.Item key="settings">
                            Settings
                        </Breadcrumb.Item>
                        <Breadcrumb.Item key="settings.permissions">
                            Permissions
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Can do="create" on="permissions">
                        <div className="page-tools">
                            <Button type="primary" onClick={showModal}>
                                Create new Permission
                            </Button>
                        </div>
                    </Can>
                </Layout.Header>
            </Affix>
            <Layout.Content className="page-content">
                <Row>
                    <Col span={24}>
                        <h2 className="form-title">Permissions</h2>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <PermissionsList
                            dataSource={data?.permissions.data}
                            loading={loading}
                            pagination={{ hideOnSinglePage: true, ...paginate }}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                {visible && (
                    <CreatePermission visible={visible} onClose={hideModal} />
                )}
            </Layout.Content>
        </Layout>
    );
};

export default Permissions;
