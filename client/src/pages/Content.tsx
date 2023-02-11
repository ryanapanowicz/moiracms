import { Layout, Menu } from "antd";
import React from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { CreateProject, Projects, UpdateProject } from ".";
import { AdminLayout } from "../components";
import { RequireAuth } from "../services";

const Content: React.FC = () => {
    const location = useLocation();
    // Only use first two forward slashes in the url
    const locationKey = location.pathname.split("/").slice(0, 3).join("/");

    return (
        <AdminLayout>
            <Layout className="page-layout" style={{ width: "1900px" }}>
                <Layout.Sider className="page-sider" width={200} theme="light">
                    <div className="page-sider-title">
                        <h1>Content</h1>
                    </div>
                    <Menu
                        selectedKeys={[locationKey]}
                        items={[
                            {
                                key: `/content/projects`,
                                label: <Link to={`projects`}>Projects</Link>,
                            },
                        ]}
                    />
                </Layout.Sider>
                <Routes>
                    <Route
                        key="projects/create"
                        path="projects/create"
                        element={
                            <RequireAuth
                                can={{
                                    action: "create",
                                    subject: "projects",
                                }}
                                redirectTo="/login"
                            >
                                <CreateProject />
                            </RequireAuth>
                        }
                    />
                    <Route path="projects/:id" element={<UpdateProject />} />
                    <Route path="projects" element={<Projects />} />
                    <Route
                        path="*"
                        element={<Navigate replace to="projects" />}
                    />
                </Routes>
            </Layout>
        </AdminLayout>
    );
};

export default Content;
