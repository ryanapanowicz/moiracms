import { createContext } from "react";

export interface AntdContextType {
    notification: any;
    modal: any;
}

const AntdContext = createContext<AntdContextType>({
    notification: undefined,
    modal: undefined,
});

export default AntdContext;
