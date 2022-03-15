import { Alert, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../assets/svg/moira-logo.svg";
import { AuthLayout, RegisterForm } from "../components";
import { useRegisterMutation } from "../graphql/mutations";
import { Auth, History } from "../services";
import { formatError } from "../utils";

const { Title } = Typography;

const Register: React.FC = () => {
    const [submitting, setSubmitting] = useState(false);
    const [register, { error }] = useRegisterMutation();

    const handleFinish = (values: any) => {
        if (!submitting) {
            register({
                variables: values,
                fetchPolicy: "network-only",
            })
                .then(({ data }) => {
                    if (data && "register" in data) {
                        const { tokens } = data.register;

                        Auth.setToken({
                            accessToken: tokens.access_token,
                            refreshToken: tokens.refresh_token,
                            expiresIn: tokens.expires_in,
                        });
                        History.replace(
                            History.location.state?.referrer || "/"
                        );
                    }
                })
                .finally(() => setSubmitting(false));
        }

        setSubmitting(true);
    };

    useEffect(() => {
        // redirect away if already signed in
        if (Auth.isAuthenticated()) {
            History.push("/");
        }
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
                    message="Registration Error"
                    description={formatError(error)}
                    type="error"
                    closable
                    style={{ marginBottom: "16px" }}
                />
            )}
            <RegisterForm onFinish={handleFinish} loading={submitting} />
        </AuthLayout>
    );
};

export default Register;
