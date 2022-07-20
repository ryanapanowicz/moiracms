import React, { useState } from "react";
import AssetModal, { AssetModalProps } from "./AssetModal";
import AssetModalContext from "./AssetModalContext";

interface AssetModalProviderProps {
    children?: React.ReactNode;
}

const AssetModalProvider: React.FC<AssetModalProviderProps> = ({
    children,
}) => {
    const [props, setProps] = useState<AssetModalProps>({});
    const [visible, setVisible] = useState(false);

    const showModal = (modalProps?: AssetModalProps) => {
        setVisible(true);
        setProps({
            ...props,
            ...modalProps,
            visible: true,
            onClose: () => {
                hideModal();
                if (typeof modalProps?.onClose == "function") {
                    modalProps.onClose();
                }
                setVisible(false);
            },
        });
    };

    const hideModal = () => {
        setProps((prevState) => ({
            ...prevState,
            visible: false,
        }));
    };

    const renderModal = () => {
        return visible && <AssetModal {...props} />;
    };

    return (
        <AssetModalContext.Provider
            value={{
                showModal: showModal,
                hideModal: hideModal,
                props: props,
            }}
        >
            {renderModal()}
            {children}
        </AssetModalContext.Provider>
    );
};

export default AssetModalProvider;
