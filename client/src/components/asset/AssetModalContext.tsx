import { createContext } from "react";
import { AssetModalProps } from "./AssetModal";

export interface AssetModalContextType {
    showModal: (modalProps?: AssetModalProps) => void;
    hideModal: () => void;
    props: AssetModalProps;
}

const AssetModalContext = createContext<AssetModalContextType>({
    showModal: () => {},
    hideModal: () => {},
    props: {},
});

export default AssetModalContext;
