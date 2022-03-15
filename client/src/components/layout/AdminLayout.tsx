import { Layout } from "antd";
import { BasicProps } from "antd/lib/layout/layout";
import React from "react";
import { Sidebar } from "..";

const AdminLayout: React.FC<BasicProps> = ({ children, ...rest }) => {
    const props = {
        ...rest,
        className: "admin-layout",
        style: { minHeight: "100vh", ...rest?.style },
        hasSider: true,
    };

    return (
        <Layout {...props}>
            <Sidebar />
            {children}
        </Layout>
    );
};

export default AdminLayout;
