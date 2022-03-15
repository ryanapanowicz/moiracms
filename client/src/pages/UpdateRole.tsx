import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Affix, Button, Col, ConfigProvider, Layout, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ServerError } from ".";
import { RenderEmpty, RolePermissionsList } from "../components";
import { useRoleQuery } from "../graphql";
import { Can, notify } from "../services";
import { AbilityContext } from "../services/Can";
import { formatError } from "../utils";
import AssignPermission from "./AssignPermission";

export type RoleDataType = {
    name: string;
    email: string;
    roles?: string[];
} | null;

export interface RoleParams {
    id: string;
}

const UpdateRole: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const ability = useAbility(AbilityContext);
    const { id } = useParams<RoleParams>();

    const { data, loading, error } = useRoleQuery({
        variables: { id: id },
    });

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    // Handle error notification for this page
    useEffect(() => {
        if (error) {
            notify.error({
                message: "Error",
                description: formatError(error),
            });
        }
    }, [error]);

    if (!data) {
        return <></>;
    }

    // Render error page if no Role was found
    if (data?.role === null) {
        return <ServerError />;
    }

    return (
        <Layout className="page">
            <Affix className="header-affix">
                <Layout.Header className="page-header">
                    <Space className="page-title" size="middle">
                        <Link to="." className="back-link">
                            <ArrowLeftOutlined />
                        </Link>
                        <h2 className="title">Edit {data?.role.name} Role</h2>
                    </Space>
                    <Can do="assign" on="permissions">
                        <div className="page-tools">
                            <Button type="primary" onClick={showModal}>
                                Assign Permission
                            </Button>
                        </div>
                    </Can>
                </Layout.Header>
            </Affix>
            <Layout.Content className="page-content">
                <Row>
                    <Col span={24}>
                        <h2 className="form-title">Role Permissions</h2>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <ConfigProvider
                            renderEmpty={() =>
                                ability.can("assign", "permissions") ? (
                                    <RenderEmpty
                                        content="No permissions assigned"
                                        btnText="Assign Permission"
                                        onClick={showModal}
                                    />
                                ) : (
                                    <RenderEmpty content="No permissions assigned" />
                                )
                            }
                        >
                            <RolePermissionsList
                                role={data?.role}
                                dataSource={data?.role.permissions}
                                loading={loading}
                            />
                        </ConfigProvider>
                    </Col>
                </Row>
                {visible && (
                    <AssignPermission
                        role={data?.role}
                        visible={visible}
                        onClose={hideModal}
                    />
                )}
            </Layout.Content>
        </Layout>
    );
};

export default UpdateRole;
