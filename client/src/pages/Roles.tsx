import { Affix, Breadcrumb, Button, Col, Layout, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CreateRole } from ".";
import { RolesList } from "../components";
import { useRolesQuery } from "../graphql";
import { Can, notify, PaginatorContext } from "../services";
import { formatError } from "../utils";

const Roles: React.FC = () => {
    const { getVariables, setVariables } = useContext(PaginatorContext);
    const [visible, setVisible] = useState(false);
    const [paginate, setPaginate] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const { data, loading, error, fetchMore } = useRolesQuery({
        variables: getVariables("roles"),
    });

    const handleChange = (page: number, pageSize?: number | undefined) => {
        const variables: any = {
            first: pageSize,
            page: page,
        };
        setVariables("roles", variables);

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
        if (data && "roles" in data) {
            const { currentPage, total, perPage, count } =
                data.roles.paginatorInfo;
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
                        <Breadcrumb.Item key="settings.roles">
                            Roles
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Can do="create" on="roles">
                        <div className="page-tools">
                            <Button type="primary" onClick={showModal}>
                                Create new Role
                            </Button>
                        </div>
                    </Can>
                </Layout.Header>
            </Affix>
            <Layout.Content className="page-content">
                <Row>
                    <Col span={24}>
                        <h2 className="form-title">Roles</h2>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <RolesList
                            dataSource={data?.roles.data}
                            loading={loading}
                            pagination={{ hideOnSinglePage: true, ...paginate }}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                {visible && (
                    <CreateRole visible={visible} onClose={hideModal} />
                )}
            </Layout.Content>
        </Layout>
    );
};

export default Roles;
