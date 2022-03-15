import { Alert, Button, Col, Divider, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout, ForgotPasswordForm } from "../components";
import { useForgotPasswordMutation } from "../graphql";
import { Auth, History } from "../services";
import { formatError } from "../utils";

const { Title } = Typography;

const ForgotPassword: React.FC = () => {
    const [forgotPassword, { error }] = useForgotPasswordMutation();
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState<any>();

    const handleFinish = (values: any) => {
        if (!submitting) {
            forgotPassword({
                variables: values,
                fetchPolicy: "network-only",
            })
                .then((response: any) => {
                    if (response.data !== undefined) {
                        setData(response.data);
                    }
                })
                .finally(() => setSubmitting(false));

            setSubmitting(true);
        }
    };

    const handleReset = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setData(undefined);
    };

    useEffect(() => {
        // redirect away if already signed in
        if (Auth.isAuthenticated()) {
            History.push("/");
        }
    }, []);

    return (
        <AuthLayout>
            {data ? (
                <>
                    <Row justify="center" style={{ marginBottom: "16px" }}>
                        <Col>
                            <Title
                                level={2}
                                style={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Email has been sent!
                            </Title>
                            <p style={{ textAlign: "center" }}>
                                Please check your email inbox and click on the
                                provided link to reset your account password.
                            </p>
                        </Col>
                    </Row>
                    <Row justify="center" style={{ marginBottom: "16px" }}>
                        <Col span="24">
                            <Link to="/login">
                                <Button block size="large" type="primary">
                                    Sign In
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col>
                            <p>
                                Didn't recieve an email?{" "}
                                <a href="/password/forgot" onClick={handleReset}>
                                    Try another email address
                                </a>
                            </p>
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    <Row justify="center" style={{ marginBottom: "16px" }}>
                        <Col>
                            <Title
                                level={2}
                                style={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Forgot your password?
                            </Title>
                            <p>
                                Please enter the email address you use to Sign
                                In.
                            </p>
                        </Col>
                    </Row>
                    {error && (
                        <Alert
                            message="Account Recovery Error"
                            description={formatError(error)}
                            type="error"
                            closable={true}
                            style={{ marginBottom: "24px" }}
                        />
                    )}
                    <ForgotPasswordForm
                        onFinish={handleFinish}
                        loading={submitting}
                    />
                    <Divider plain>Or</Divider>
                    <Row justify="center">
                        <Col>
                            <Link to="/login">Back to Sign in</Link>
                        </Col>
                    </Row>
                </>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
