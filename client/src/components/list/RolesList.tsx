import { EditOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Button, List } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DeleteButton } from "..";
import { useDeleteRoleMutation } from "../../graphql";
import { MeQuery } from "../../graphql/queries/useMeQuery";
import { useNotify } from "../../hooks";
import { PaginatorContext } from "../../services";
import { AbilityContext } from "../../services/Can";

export type RolesListProps = {
    dataSource?: any;
    loading?: boolean;
    pagination?: any;
    onChange?: (page: number, pageSize?: number | undefined) => void;
};

const RolesList: React.FC<RolesListProps> = ({
    dataSource,
    loading,
    pagination,
    onChange,
}) => {
    const { setVariables } = useContext(PaginatorContext);
    const notify = useNotify();

    const ability = useAbility(AbilityContext);
    const canEdit = ability.can("edit", "roles");
    const canDelete = ability.can("delete", "roles");

    // Update refetch query if saved varables for query in state or context
    // check if last page or empty page by using count and hanle accordingly.
    const [deleteRole] = useDeleteRoleMutation({
        update: (cache, { data }) => {
            cache.evict({
                id: cache.identify({
                    __typename: "Role",
                    id: data?.deleteRole.role.id,
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

            if (observableQuery.queryName === "roles" && data) {
                const { currentPage, count } = data.roles.paginatorInfo;
                variables.page = currentPage;

                // If last item in current page, move down a page.
                if (currentPage > 1 && count === 1) {
                    variables.page = currentPage - 1;
                }

                setVariables("roles", variables);

                return observableQuery.refetch(variables);
            }

            return false;
        },
        onCompleted: ({ deleteRole }) => {
            if (deleteRole) {
                notify.success({
                    message: "Success",
                    description: `Role "${deleteRole.role.name}" successfully deleted!`,
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
            renderItem={({ id, name, users }: any) => (
                <List.Item
                    actions={[
                        ...(canEdit
                            ? [
                                  <Link to={`${id}`}>
                                      <Button
                                          type="link"
                                          icon={<EditOutlined />}
                                      />
                                  </Link>,
                              ]
                            : []),
                        ...(canDelete
                            ? [
                                  <DeleteButton
                                      title="Are you sure you want to delete this Role?"
                                      content={`Deleting Role "${name}" cannot be undone.`}
                                      onClose={() =>
                                          deleteRole({
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
                    <List.Item.Meta
                        title={name}
                        description={
                            users &&
                            `${users.length} ${
                                users.length === 1 ? "user" : "users"
                            }`
                        }
                    />
                </List.Item>
            )}
        />
    );
};

export default RolesList;
