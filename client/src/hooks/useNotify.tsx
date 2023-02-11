import { useContext } from "react";
import { AntdContext } from "../services";

export interface NotifyArgs {
    message: React.ReactNode;
    description?: React.ReactNode;
}

type PlacementType = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

interface NotifyDefaults {
    placement: PlacementType;
}

const defaults: NotifyDefaults = {
    placement: "bottomRight",
};

const useNotify = () => {
    const { notification } = useContext(AntdContext);

    return {
        success: (args: NotifyArgs) => {
            notification.open({
                ...defaults,
                ...args,
                className: "ant-notification-notice-success",
            });
        },
        error: (args: NotifyArgs) => {
            notification.open({
                ...defaults,
                ...args,
                className: "ant-notification-notice-error",
            });
        },
        info: (args: NotifyArgs) => {
            notification.open({
                ...defaults,
                ...args,
                className: "ant-notification-notice-info",
            });
        },
        warning: (args: NotifyArgs) => {
            notification.open({
                ...defaults,
                ...args,
                className: "ant-notification-notice-warning",
            });
        },
        open: (args: NotifyArgs) => {
            notification.open({
                ...defaults,
                ...args,
            });
        },
    };
};

export default useNotify;
