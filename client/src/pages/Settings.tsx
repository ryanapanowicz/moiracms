import { useAbility } from "@casl/react";
import { Layout, Menu } from "antd";
import React, { useMemo } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
    CreateUser,
    Permissions,
    Roles,
    UpdateRole,
    UpdateUser,
    Users
} from ".";
import { AdminLayout } from "../components";
import { RequireAuth } from "../services";
import { AbilityContext } from "../services/Can";
import { titleCase } from "../utils";

const defaultMenu = ["users", "roles", "permissions"];

const Settings: React.FC = () => {
    const ability = useAbility(AbilityContext);
    const location = useLocation();

    // Only use first two forward slashes in the url
    const locationKey = location.pathname.split("/").slice(0, 3).join("/");

    const menu = useMemo(
        () =>
            defaultMenu.map((name) => ({
                title: titleCase(name),
                url: `${name}`,
                enabled: ability.can("view", name),
            })),
        [ability]
    );

    return (
        <AdminLayout>
            <Layout className="page-layout">
                {menu.find((item) => item.enabled) && (
                    <Layout.Sider className="page-sider">
                        <div className="page-sider-title">
                            <h1>Settings</h1>
                        </div>
                        <Menu
                            selectedKeys={[locationKey]}
                            items={menu.map((item) => ({
                                key: `/settings/${item.url}`,
                                disabled: !item.enabled,
                                label: <Link to={item.url}>{item.title}</Link>,
                            }))}
                        />
                    </Layout.Sider>
                )}
                <Routes>
                    <Route
                        path="users/create"
                        element={
                            <RequireAuth
                                can={{ action: "create", subject: "projects" }}
                                redirectTo="/login"
                            >
                                <CreateUser />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="users/:id"
                        element={
                            <RequireAuth
                                can={{ action: "view", subject: "users" }}
                                redirectTo="/login"
                            >
                                <UpdateUser />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="users"
                        element={
                            <RequireAuth
                                can={{ action: "view", subject: "users" }}
                                redirectTo="/login"
                            >
                                <Users />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="roles/:id"
                        element={
                            <RequireAuth
                                can={{ action: "view", subject: "roles" }}
                                redirectTo="/login"
                            >
                                <UpdateRole />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="roles"
                        element={
                            <RequireAuth
                                can={{ action: "view", subject: "roles" }}
                                redirectTo="/login"
                            >
                                <Roles />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="permissions"
                        element={
                            <RequireAuth
                                can={{ action: "view", subject: "permissions" }}
                                redirectTo="/login"
                            >
                                <Permissions />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <Navigate
                                replace
                                to={`${
                                    menu.find((item) => item.enabled)?.url ||
                                    "404"
                                }`}
                            />
                        }
                    />
                </Routes>
            </Layout>
        </AdminLayout>
    );
};

export default Settings;
