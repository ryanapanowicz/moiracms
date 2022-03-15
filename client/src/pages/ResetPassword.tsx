import { Alert, Button, Col, Divider, Row, Typography } from "antd";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthLayout, ResetPasswordForm } from "../components";
import { useResetPasswordMutation } from "../graphql";
import { formatError } from "../utils";

interface ResetPasswordParams {
    token: string;
}

const { Title } = Typography;

const ResetPassword: React.FC = () => {
    const { token } = useParams<ResetPasswordParams>();
    const [submitting, setSubmitting] = useState(false);
    const [resetPassword, { data, error }] = useResetPasswordMutation();

    const handleFinish = (values: any) => {
        if (!submitting && typeof values === "object") {
            const input = { ...values, token: token };
            resetPassword({
                variables: input,
                fetchPolicy: "network-only",
            }).finally(() => setSubmitting(false));
        }

        setSubmitting(true);
    };

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
                                Password changed!
                            </Title>
                            <p style={{ textAlign: "center" }}>
                                You can now Sign In using your new password.
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
                                Reset Password
                            </Title>
                            <p style={{ textAlign: "center" }}>
                                Enter the email address you use to Sign In, and
                                set your new password with confirmation.
                            </p>
                        </Col>
                    </Row>
                    {error && (
                        <Alert
                            message="Reset Password Error"
                            description={formatError(error)}
                            type="error"
                            closable={true}
                            style={{ marginBottom: "24px" }}
                        />
                    )}
                    <ResetPasswordForm
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

export default ResetPassword;
