import { useAbility } from "@casl/react";
import { Layout, Menu } from "antd";
import React, { useMemo } from "react";
import {
    Link,
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
} from "react-router-dom";
import {
    CreateUser,
    Permissions,
    Roles,
    UpdateRole,
    UpdateUser,
    Users,
} from ".";
import { AdminLayout } from "../components";
import { ProtectedRoute } from "../services";
import { AbilityContext } from "../services/Can";
import { titleCase } from "../utils";

const defaultMenu = ["users", "roles", "permissions"];

const Settings: React.FC<RouteComponentProps> = ({ match, location }) => {
    const ability = useAbility(AbilityContext);

    // Only use first two forward slashes in the url
    const locationKey = location.pathname.split("/").slice(0, 3).join("/");

    const menu = useMemo(
        () =>
            defaultMenu.map((name) => ({
                title: titleCase(name),
                url: `${match.path}/${name}`,
                enabled: ability.can("view", name),
            })),
        [match.path, ability]
    );

    return (
        <AdminLayout>
            <Layout className="page-layout">
                {menu.find((item) => item.enabled) && (
                    <Layout.Sider className="page-sider">
                        <div className="page-sider-title">
                            <h1>Settings</h1>
                        </div>
                        <Menu selectedKeys={[locationKey]}>
                            {menu.map((item) => (
                                <Menu.Item
                                    key={item.url}
                                    disabled={!item.enabled}
                                >
                                    <Link to={item.url}>{item.title}</Link>
                                </Menu.Item>
                            ))}
                        </Menu>
                    </Layout.Sider>
                )}
                <Switch>
                    <ProtectedRoute
                        can={{ action: "create", subject: "users" }}
                        path={`${match.path}/users/create`}
                        component={CreateUser}
                    />
                    <ProtectedRoute
                        can={{ action: "view", subject: "users" }}
                        path={`${match.path}/users/:id`}
                        component={UpdateUser}
                    />
                    <ProtectedRoute
                        can={{ action: "view", subject: "users" }}
                        path={`${match.path}/users`}
                        component={Users}
                    />
                    <ProtectedRoute
                        can={{ action: "view", subject: "roles" }}
                        path={`${match.path}/roles/:id`}
                        component={UpdateRole}
                    />
                    <ProtectedRoute
                        can={{ action: "view", subject: "roles" }}
                        path={`${match.path}/roles`}
                        component={Roles}
                    />
                    <ProtectedRoute
                        can={{ action: "view", subject: "permissions" }}
                        path={`${match.path}/permissions`}
                        component={Permissions}
                    />
                    <Route
                        path={match.path}
                        render={() => (
                            <Redirect
                                to={`${
                                    menu.find((item) => item.enabled)?.url ||
                                    "404"
                                }`}
                            />
                        )}
                    />
                </Switch>
            </Layout>
        </AdminLayout>
    );
};

export default Settings;
