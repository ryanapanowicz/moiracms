import { Col, Layout, Row } from "antd";
import { BasicProps } from "antd/lib/layout/layout";
import React from "react";

const { Content } = Layout;

const AuthLayout: React.FC<BasicProps> = ({ children, ...rest}) => {
    const props = {
        ...rest,
        style: { minHeight: "100vh", ...rest?.style },
    };

    return (
        <Layout {...props}>
            <Content>
                <Row
                    justify="center"
                    align="middle"
                    style={{ minHeight: "100vh" }}
                >
                    <Col
                        span={6}
                        style={{ minWidth: "400px", maxWidth: "400px" }}
                    >
                        {children}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default AuthLayout;
