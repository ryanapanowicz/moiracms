import { Avatar } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AssetModalContext } from "../asset";

export interface ProfileImageInputProps {
    title?: string;
    value?: string;
    onChange?: (changeValue: any) => void;
}

const ProfileImageInput: React.FC<ProfileImageInputProps> = ({
    title,
    value,
    onChange,
}) => {
    const { showModal, hideModal } = useContext(AssetModalContext);
    const [image, setImage] = useState(value);

    useEffect(() => {
        onChange?.(image);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image]);

    const handleClick = () => {
        showModal({
            type: "view",
            gallery: { enabled: true, maxSelection: 1 },
            onSubmit: (selected) => {
                if (selected.length) {
                    setImage(selected.shift().url);
                    hideModal();
                }
            },
        });
    };

    return (
        <div className="profile-image-link" onClick={handleClick}>
            <Avatar
                style={{
                    backgroundColor: "#141c5c",
                    verticalAlign: "middle",
                }}
                src={image}
                size={160}
                shape="square"
            >
                {title}
            </Avatar>
            <div className="ant-image-mask">
                <div className="ant-image-mask-info">Edit</div>
            </div>
        </div>
    );
};

export default ProfileImageInput;
