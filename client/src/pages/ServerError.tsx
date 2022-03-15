import { Button, Layout, Result } from "antd";
import React from "react";
import { ReactComponent as Error } from "../assets/svg/404-icon.svg";
import { History } from "../services";

const ServerError: React.FC = () => {
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
                                History.goBack();
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
