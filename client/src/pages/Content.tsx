import { Layout, Menu } from "antd";
import React from "react";
import {
    Link,
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
} from "react-router-dom";
import { CreateProject, Projects, UpdateProject } from ".";
import { AdminLayout } from "../components";
import { ProtectedRoute } from "../services";

const Content: React.FC<RouteComponentProps> = ({ match, location }) => {
    // Only use first two forward slashes in the url
    const locationKey = location.pathname.split("/").slice(0, 3).join("/");

    return (
        <AdminLayout>
            <Layout className="page-layout">
                <Layout.Sider className="page-sider">
                    <div className="page-sider-title">
                        <h1>Content</h1>
                    </div>
                    <Menu selectedKeys={[locationKey]}>
                        <Menu.Item key={`${match.path}/projects`}>
                            <Link to={`${match.path}/projects`}>Projects</Link>
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Switch>
                    <ProtectedRoute
                        can={{ action: "create", subject: "projects" }}
                        path={`${match.path}/projects/create`}
                        component={CreateProject}
                    />
                    <Route
                        path={`${match.path}/projects/:id`}
                        component={UpdateProject}
                    />
                    <Route
                        path={`${match.path}/projects`}
                        component={Projects}
                    />
                    <Route
                        path={match.path}
                        render={() => (
                            <Redirect to={`${match.path}/projects`} />
                        )}
                    />
                </Switch>
            </Layout>
        </AdminLayout>
    );
};

export default Content;
