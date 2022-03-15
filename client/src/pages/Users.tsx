import { Affix, Breadcrumb, Button, Layout } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { UsersTable } from "../components";
import { useUsersQuery } from "../graphql";
import { Can, notify, PaginatorContext } from "../services";
import { formatError, getSorterVars } from "../utils";

const Users: React.FC<RouteComponentProps> = ({ match }) => {
    const { getVariables, setVariables } = useContext(PaginatorContext);
    const [paginate, setPaginate] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const { data, error, loading, fetchMore } = useUsersQuery({
        variables: getVariables("users"),
    });

    const handleChange = ({ pageSize, current }: any, _: any, sorter: any) => {
        const variables: any = {
            first: pageSize,
            page: current,
            // Add order_by variables to GQL query
            ...getSorterVars(sorter),
        };
        setVariables("users", variables);

        fetchMore({
            variables: variables,
        });
    };

    // Update pagination on data change
    useEffect(() => {
        if (data && "users" in data) {
            const { currentPage, total, perPage, count } =
                data.users.paginatorInfo;
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
                        <Breadcrumb.Item key="settings.users">
                            Users
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Can do="create" on="users">
                        <div className="page-tools">
                            <Button type="primary">
                                <Link to={`${match.path}/create`}>
                                    Create new User
                                </Link>
                            </Button>
                        </div>
                    </Can>
                </Layout.Header>
            </Affix>
            <Layout.Content className="page-content">
                <UsersTable
                    dataSource={data?.users.data}
                    loading={loading}
                    pagination={{ hideOnSinglePage: true, ...paginate }}
                    onChange={handleChange}
                />
            </Layout.Content>
        </Layout>
    );
};

export default Users;
