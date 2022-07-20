import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useVerifyEmailMutation from "../graphql/mutations/useVerifyEmailMutation";

const VerifyEmail: React.FC = () => {
    const { token } = useParams();
    const [verifyEmail, { data, error }] = useVerifyEmailMutation();

    useEffect(() => {
        verifyEmail({
            variables: token ? { token: token } : undefined,
            fetchPolicy: "network-only",
        });
    }, [verifyEmail, token]);

    return (
        <>
            <div>{error && JSON.stringify(error)}</div>
            <div>{data && JSON.stringify(data)}</div>
        </>
    );
};

export default VerifyEmail;
