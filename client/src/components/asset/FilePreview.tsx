import { FileOutlined } from "@ant-design/icons";
import { Card } from "antd";
import React from "react";
import { Media } from "../../graphql/types";
import { formatBytes } from "../../utils";

export type FilePreviewProps = {
    file: Media;
    className?: string;
    overlay?: boolean;
    overlayTitle?: React.ReactNode;
};

const FilePreview: React.FC<FilePreviewProps> = ({
    file,
    className,
    overlay,
    overlayTitle,
}) => {
    return (
        <Card
            className={["asset-item", className].join(" ").trim()}
            size="small"
            bordered={false}
            cover={
                <>
                    {file.type === "image" ? (
                        <img
                            src={file.preview}
                            alt={file.alternative_text}
                            draggable="false"
                        />
                    ) : (
                        <>
                            <svg
                                className="asset-item-background"
                                viewBox="0 0 4 3"
                            />
                            <div className="asset-item-preview">
                                <FileOutlined className="asset-item-icon" />
                            </div>
                        </>
                    )}
                    {overlay && (
                        <div className="ant-image-mask">
                            <div className="ant-image-mask-info">
                                {overlayTitle}
                            </div>
                        </div>
                    )}
                </>
            }
        >
            <Card.Meta
                title={file.file_name}
                description={formatBytes(file.size)}
            />
        </Card>
    );
};

export default FilePreview;
