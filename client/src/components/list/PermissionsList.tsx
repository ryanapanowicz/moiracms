import { useAbility } from "@casl/react";
import { List } from "antd";
import React, { useContext } from "react";
import { DeleteButton } from "..";
import { useDeletePermissionMutation } from "../../graphql";
import { MeQuery } from "../../graphql/queries/useMeQuery";
import { notify, PaginatorContext } from "../../services";
import { AbilityContext } from "../../services/Can";

export type PermissionsListProps = {
    dataSource?: any[];
    loading?: boolean;
    pagination?: any;
    onChange?: (page: number, pageSize?: number | undefined) => void;
};

const PermissionsList: React.FC<PermissionsListProps> = ({
    dataSource,
    loading,
    pagination,
    onChange,
}) => {
    const { setVariables } = useContext(PaginatorContext);

    const ability = useAbility(AbilityContext);

    // Update refetch query if saved varables for query in state or context
    // check if last page or empty page by using count and hanle accordingly.
    const [deletePermission] = useDeletePermissionMutation({
        update: (cache, { data }) => {
            cache.evict({
                id: cache.identify({
                    __typename: "Permission",
                    id: data?.deletePermission.permission.id,
                }),
            });
        },
        refetchQueries: [
            {
                query: MeQuery,
            },
        ],
        onQueryUpdated(observableQuery) {
            const { data } = observableQuery.getCurrentResult();
            const variables = { ...observableQuery.variables };

            if (observableQuery.queryName === "permissions" && data) {
                const { currentPage, count } = data.permissions.paginatorInfo;
                variables.page = currentPage;

                // If last item in current page, move down a page.
                if (currentPage > 1 && count === 1) {
                    variables.page = currentPage - 1;
                }

                setVariables("permissions", variables);

                return observableQuery.refetch(variables);
            }

            return false;
        },
        onCompleted: ({ deletePermission }) => {
            if (deletePermission) {
                notify.success({
                    message: "Success",
                    description: `Permission "${deletePermission.permission.name}" successfully deleted!`,
                });
            }
        },
    });

    return (
        <List
            className="item-list"
            itemLayout="horizontal"
            size="small"
            loading={loading}
            dataSource={dataSource}
            pagination={{
                ...pagination,
                onChange: onChange,
            }}
            renderItem={({ id, name }: any) => (
                <List.Item
                    actions={[
                        ...(ability.can("delete", "permissions")
                            ? [
                                  <DeleteButton
                                      title="Are you sure you want to delete this Permission?"
                                      content={`Deleting Permission "${name}" cannot be undone.`}
                                      onClose={() =>
                                          deletePermission({
                                              variables: {
                                                  id: id,
                                              },
                                          })
                                      }
                                  />,
                              ]
                            : []),
                    ]}
                >
                    <List.Item.Meta title={name} />
                </List.Item>
            )}
        />
    );
};

export default PermissionsList;
