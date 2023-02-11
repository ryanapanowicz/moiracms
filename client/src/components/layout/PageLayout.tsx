import { Layout, theme } from "antd";
import React from "react";

export interface PageLayoutProps {
    header?: React.ReactNode;
    children?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ header, children }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout className="page">
            <Layout.Header
                className="page-header"
                style={{
                    background: colorBgContainer,
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    width: "100%",
                }}
            >
                {header}
            </Layout.Header>
            <Layout.Content className="page-content">{children}</Layout.Content>
        </Layout>
    );
};

export default PageLayout;
