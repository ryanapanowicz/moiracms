import { Button } from "antd";
import React from "react";

export interface RenderEmptyProps {
    content?: string;
    btnText?: string;
    onClick?: () => void;
}

const RenderEmpty: React.FC<RenderEmptyProps> = ({
    content,
    btnText,
    onClick,
}) => (
    <div className="item-list-empty">
        <p>{content}</p>
        {btnText && (
            <Button type="primary" onClick={onClick}>
                {btnText}
            </Button>
        )}
    </div>
);

export default RenderEmpty;
