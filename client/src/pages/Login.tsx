import { Alert, Col, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/svg/moira-logo.svg";
import { AuthLayout, LoginForm } from "../components";
import { useLoginMutation } from "../graphql";
import { Auth, UserContext } from "../services";
import { LocationState } from "../services/types";
import { formatError } from "../utils";

const { Title } = Typography;

const Login: React.FC = () => {
    const [submitting, setSubmitting] = useState(false);
    const [login, { error }] = useLoginMutation();
    const { query } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location as LocationState;

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

                    navigate(state?.referrer || "/content/projects", {
                        replace: true,
                    });
                }
            } catch (e) {
                setSubmitting(false);
            }
        }
    };

    useEffect(() => {
        // redirect away if already signed in
        if (Auth.isAuthenticated()) {
            navigate("/");
        }

        return () => {
            setSubmitting(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
