import { Alert, Col, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as Logo } from "../assets/svg/moira-logo.svg";
import { AuthLayout, LoginForm } from "../components";
import { useLoginMutation } from "../graphql";
import { Auth, History, UserContext } from "../services";
import { formatError } from "../utils";

const { Title } = Typography;

const Login: React.FC = () => {
    const [submitting, setSubmitting] = useState(false);
    const [login, { error }] = useLoginMutation();
    const { query } = useContext(UserContext);

    const handleFinish = async (values: any) => {
        if (!submitting) {
            setSubmitting(true);

            try {
                const { data } = await login({
                    variables: values,
                    fetchPolicy: "network-only",
                });

                setSubmitting(false);

                if (data) {
                    Auth.setToken({
                        accessToken: data.login.access_token,
                        refreshToken: data.login.refresh_token,
                        expiresIn: data.login.expires_in,
                    });

                    query();

                    History.replace(
                        History.location.state?.referrer || "/content/projects"
                    );
                }
            } catch (e) {
                setSubmitting(false);
            }
        }
    };

    useEffect(() => {
        // redirect away if already signed in
        if (Auth.isAuthenticated()) {
            History.push("/");
        }

        return () => {
            setSubmitting(false);
        };
    }, []);

    return (
        <AuthLayout>
            <Row justify="center">
                <Col>
                    <Logo width="64" style={{ margin: "0 0 5px 0" }} />
                </Col>
            </Row>
            <Row justify="center">
                <Col>
                    <Title
                        style={{
                            fontWeight: "bold",
                            textAlign: "center",
                            margin: "0 0 40px 0",
                        }}
                    >
                        Moira CMS
                    </Title>
                </Col>
            </Row>
            {error && (
                <Alert
                    message="Sign In Error"
                    description={formatError(error)}
                    type="error"
                    closable={true}
                    style={{ marginBottom: "24px" }}
                />
            )}
            <LoginForm onFinish={handleFinish} loading={submitting} />
        </AuthLayout>
    );
};

export default Login;
