import { EditOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Button, Divider, Space, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteButton } from "..";
import { useDeleteProjectMutation } from "../../graphql";
import { useNotify } from "../../hooks";
import { PaginatorContext } from "../../services";
import { AbilityContext } from "../../services/Can";

export type ProjectsTableProps = {
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
        title: "Title",
        dataIndex: "title",
        sorter: true,
    },
    {
        title: "Slug",
        dataIndex: "slug",
        sorter: true,
    },
];

const ProjectsTable: React.FC<ProjectsTableProps> = ({
    dataSource,
    loading,
    pagination,
    onChange,
}) => {
    const { getVariables, setVariables } = useContext(PaginatorContext);
    const [columns, setColumns] = useState(defaultCol);
    const notify = useNotify();
    
    const ability = useAbility(AbilityContext);
    const canEdit = ability.can("edit", "projects");
    const canDelete = ability.can("delete", "projects");

    // Update refetch query if saved varables for query in state or context
    // check if last page or empty page by using count and handle accordingly.
    const [deleteProject] = useDeleteProjectMutation({
        update: (cache, { data }) => {
            cache.evict({
                id: cache.identify({
                    __typename: "Project",
                    id: data?.deleteProject.project.id,
                }),
            });
        },
        onQueryUpdated(observableQuery) {
            const { data } = observableQuery.getCurrentResult();
            const variables = { ...observableQuery.variables };

            if (observableQuery.queryName === "projects" && data) {
                const { currentPage, count } = data.projects.paginatorInfo;
                variables.page = currentPage;

                // If last item in current page, move down a page.
                if (currentPage > 1 && count === 1) {
                    variables.page = currentPage - 1;
                }

                setVariables("projects", variables);

                return observableQuery.refetch(variables);
            }
        },
        onCompleted: ({ deleteProject }) => {
            if (deleteProject) {
                notify.success({
                    message: "Success",
                    description: `Project "${deleteProject.project.id}" successfully deleted!`,
                });
            }
        },
    });

    useEffect(() => {
        const variables = getVariables("projects");
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
        if (canEdit || canDelete) {
            setColumns([
                ...defaultCol,
                {
                    title: "Action",
                    dataIndex: "action",
                    width: "0",
                    render: (_: any, { id }: any) => (
                        <Space split={<Divider type="vertical" />}>
                            {canEdit && (
                                <Link to={`${id}`}>
                                    <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                    />
                                </Link>
                            )}
                            {canDelete && (
                                <DeleteButton
                                    title="Are you sure you want to delete this project?"
                                    content={`Deleting Project "${id}" cannot be undone.`}
                                    onClose={() =>
                                        deleteProject({
                                            variables: { id: id },
                                        })
                                    }
                                />
                            )}
                        </Space>
                    ),
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canEdit, canDelete]);

    return (
        <Table
            className="table projects-table"
            columns={columns}
            rowKey={({ id }) => id}
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
        />
    );
};

export default ProjectsTable;
