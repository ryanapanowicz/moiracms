import { useAbility } from "@casl/react";
import { List } from "antd";
import React from "react";
import { DeleteButton } from "..";
import { useRevokePermissionToRoleMutation } from "../../graphql";
import { MeQuery } from "../../graphql/queries/useMeQuery";
import { Role } from "../../graphql/types";
import { useNotify } from "../../hooks";
import { AbilityContext } from "../../services/Can";

export interface RolePermissionsListProps {
    role: Role;
    dataSource?: any[];
    loading?: boolean;
}

const RolePermissionsList: React.FC<RolePermissionsListProps> = ({
    role,
    dataSource,
    loading,
}) => {
    const ability = useAbility(AbilityContext);
    const canRevoke = ability.can("revoke", "permissions");
    const notify = useNotify();

    const [revokePermissionToRole] = useRevokePermissionToRoleMutation({
        update: (cache, { data }) => {
            cache.evict({
                id: cache.identify({
                    __typename: "Role",
                    id: data?.revokePermissionToRole.role.id,
                }),
            });
        },
        refetchQueries: [
            {
                query: MeQuery,
            },
        ],
        onQueryUpdated(observableQuery) {
            return observableQuery.refetch();
        },
        onCompleted: ({ revokePermissionToRole }) => {
            if (revokePermissionToRole) {
                notify.success({
                    message: "Success",
                    description: `Permission removed from "${revokePermissionToRole.role.name}" successfully!`,
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
            renderItem={({ name }: any) => (
                <List.Item
                    actions={[
                        ...(canRevoke
                            ? [
                                  <DeleteButton
                                      title="Are you sure you want to remove this permission?"
                                      content={`Removing this permission "${name}".`}
                                      okText="Remove"
                                      width={450}
                                      onClose={() =>
                                          revokePermissionToRole({
                                              variables: {
                                                  role: role.name,
                                                  permission: [name],
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

export default RolePermissionsList;
