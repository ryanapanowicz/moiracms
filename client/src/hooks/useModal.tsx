import { useContext } from "react";
import { AntdContext } from "../services";

const useModal = () => {
    const { modal } = useContext(AntdContext);
    return modal;
};

export default useModal;
