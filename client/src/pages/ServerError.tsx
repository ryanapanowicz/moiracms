import { Button, Layout, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Error } from "../assets/svg/404-icon.svg";

const ServerError: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout className="page error-page">
            <Layout.Content>
                <Result
                    icon={<Error />}
                    subTitle="Sorry, the page you visited does not exist."
                    extra={
                        <Button
                            type="primary"
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Go Back
                        </Button>
                    }
                />
            </Layout.Content>
        </Layout>
    );
};

export default ServerError;
