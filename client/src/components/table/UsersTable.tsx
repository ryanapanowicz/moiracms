import { EditOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Button, Divider, Space, Table, Tag } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteButton } from "..";
import { useDeleteUserMutation } from "../../graphql";
import { notify, PaginatorContext } from "../../services";
import { AbilityContext } from "../../services/Can";
import { titleCase } from "../../utils";

export type UsersTableProps = {
    dataSource?: any;
    loading?: boolean;
    pagination?: any;
    onChange?: any;
};

const defaultCol: any = [
    {
        title: "ID",
        dataIndex: "id",
        sorter: true,
    },
    {
        title: "Name",
        dataIndex: "name",
        sorter: true,
    },
    {
        title: "Email",
        dataIndex: "email",
        sorter: true,
    },
];

const UsersTable: React.FC<UsersTableProps> = ({
    dataSource,
    loading,
    pagination,
    onChange,
}) => {
    const { getVariables, setVariables } = useContext(PaginatorContext);
    const [columns, setColumns] = useState(defaultCol);

    const ability = useAbility(AbilityContext);

    // Update refetch query if saved varables for query in state or context
    // check if last page or empty page by using count and handle accordingly.
    const [deleteUser] = useDeleteUserMutation({
        update: (cache, { data }) => {
            cache.evict({
                id: cache.identify({
                    __typename: "User",
                    id: data?.deleteUser.user.id,
                }),
            });
        },
        onQueryUpdated(observableQuery) {
            const { data } = observableQuery.getCurrentResult();
            const variables = { ...observableQuery.variables };

            if (observableQuery.queryName === "users" && data) {
                const { currentPage, count } = data.users.paginatorInfo;
                variables.page = currentPage;

                // If last item in current page, move down a page.
                if (currentPage > 1 && count === 1) {
                    variables.page = currentPage - 1;
                }

                setVariables("users", variables);

                return observableQuery.refetch(variables);
            }

            return false;
        },
        onCompleted: ({ deleteUser }) => {
            if (deleteUser) {
                notify.success({
                    message: "Success",
                    description: `User "${deleteUser.user.name}" successfully deleted!`,
                });
            }
        },
    });

    useEffect(() => {
        const variables = getVariables("users");
        const updateColumns = [...columns];

        updateColumns.map((col: any) => {
            // Remove any sort order if it already exists
            delete col.sortOrder;

            if ("order_by" in variables) {
                const { order, column } = variables.order_by[0];
                const sortOrder = order === "DESC" ? "descend" : "ascend";

                // Set sort order for table using saved query variables
                if (col.dataIndex === column) {
                    col.sortOrder = sortOrder;
                }
            }

            return col;
        });

        setColumns(updateColumns);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getVariables]);

    useEffect(() => {
        let columns = [];

        if (ability.can("view", "roles")) {
            columns.push({
                title: "Roles",
                dataIndex: "roles",
                render: (roles: any) => (
                    <>
                        {roles &&
                            roles.map(({ name, id }: any) => (
                                <Tag color="default" key={id}>
                                    {titleCase(name)}
                                </Tag>
                            ))}
                    </>
                ),
            });
        }

        if (ability.can("edit", "users") || ability.can("delete", "users")) {
            columns.push({
                title: "Action",
                dataIndex: "action",
                width: "0",
                render: (_: any, { id, name }: any) => (
                    <Space split={<Divider type="vertical" />}>
                        {ability.can("edit", "users") && (
                            <Link to={`${id}`}>
                                <Button type="link" icon={<EditOutlined />} />
                            </Link>
                        )}
                        {ability.can("delete", "users") && (
                            <DeleteButton
                                title="Are you sure you want to delete this user?"
                                content={`Deleting User "${name}" cannot be undone.`}
                                onClose={() =>
                                    deleteUser({
                                        variables: { id: id },
                                    })
                                }
                            />
                        )}
                    </Space>
                ),
            });
        }

        setColumns([...defaultCol, ...columns]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Table
            className="table users-table"
            columns={columns}
            rowKey={({ id }) => id}
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
        />
    );
};

export default UsersTable;
