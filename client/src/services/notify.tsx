import { notification } from "antd";

export interface NotifyArgs {
    message: React.ReactNode;
    description?: React.ReactNode;
}

export interface NotifyType {
    success(args: NotifyArgs): void;
    error(args: NotifyArgs): void;
    info(args: NotifyArgs): void;
    warning(args: NotifyArgs): void;
    open(args: NotifyArgs): void;
}

type PlacementType = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

interface NotifyDefaults {
    placement: PlacementType;
}

const defaults: NotifyDefaults = {
    placement: "bottomRight",
};

const notify: NotifyType = {
    success(args) {
        notification.open({
            ...defaults,
            ...args,
            className: "ant-notification-notice-success",
        });
    },
    error(args) {
        notification.open({
            ...defaults,
            ...args,
            className: "ant-notification-notice-error",
        });
    },
    info(args) {
        notification.open({
            ...defaults,
            ...args,
            className: "ant-notification-notice-info",
        });
    },
    warning(args) {
        notification.open({
            ...defaults,
            ...args,
            className: "ant-notification-notice-warning",
        });
    },
    open(args) {
        notification.open({
            ...defaults,
            ...args,
        });
    },
};

export default notify;
