import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, Modal, notification as Notification } from "antd";
import React from "react";
import { AntdContext } from ".";
import theme from "../theme";

interface AntdProviderProps {
    children?: React.ReactNode;
}

const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
    const [modal, modalContext] = Modal.useModal();
    const [notification, notificationContext] = Notification.useNotification();

    return (
        <ConfigProvider theme={theme}>
            <StyleProvider hashPriority="high">
                <AntdContext.Provider
                    value={{ modal: modal, notification: notification }}
                >
                    {notificationContext}
                    {modalContext}
                    {children}
                </AntdContext.Provider>
            </StyleProvider>
        </ConfigProvider>
    );
};

export default AntdProvider;
