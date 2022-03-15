import { ArrowLeftOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { FetchResult } from "@apollo/client";
import { Alert, Button, Space, Upload } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useContext, useEffect, useState } from "react";
import { useUploadMutation } from "../../graphql";
import { UploadType } from "../../graphql/mutations/useUploadMutation";
import { AssetsQuery } from "../../graphql/queries/useAssetsQuery";
import { PaginatorContext, UserContext } from "../../services";
import { formatError } from "../../utils";

export interface UploaderProps {
    status?: (working: boolean) => void;
    showBackBtn?: boolean;
    onBack?: (event: React.MouseEvent) => void;
    onCancel?: (event: React.MouseEvent) => void;
    onUpload?: (
        data: FetchResult<UploadType, Record<string, any>, Record<string, any>>
    ) => void;
}

const fileTypes = [
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/gif",
    "image/svg+xml",
    "image/webp",
];

const Uploader: React.FC<UploaderProps> = ({
    status,
    showBackBtn = false,
    onBack,
    onCancel,
    onUpload,
}) => {
    const { getVariables } = useContext(PaginatorContext);
    const { user } = useContext(UserContext);
    const [files, setFiles] = useState<any[]>();

    const [upload, { loading, error }] = useUploadMutation();

    useEffect(() => {
        typeof status === "function" && status(loading);
    }, [status, loading]);

    const handleUpload = () => {
        if (!loading && user && files?.length) {
            upload({
                variables: {
                    ref_id: user.me.id,
                    files: files,
                },
                refetchQueries: [
                    {
                        query: AssetsQuery,
                        variables: getVariables("assets"),
                    },
                ],
            }).then((response) => {
                // Clear file upload list
                setFiles([]);

                typeof onUpload === "function" && onUpload(response);
            });
        }
    };

    const handleBack = (event: React.MouseEvent<HTMLElement>) => {
        !loading && typeof onBack === "function" && onBack(event);
    };

    const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
        !loading && typeof onCancel === "function" && onCancel(event);
    };

    const handleRemove = (file: UploadFile<any>) => {
        setFiles((prevState) => {
            if (prevState) {
                const index = prevState.indexOf(file);
                const newFiles = prevState.slice();
                newFiles.splice(index, 1);
                return newFiles;
            }
        });
    };

    const handleBeforeUpload = (file: UploadFile<any>) => {
        setFiles((prevState) => (prevState ? [...prevState, file] : [file]));

        // Prevent antd from auto submiting
        return false;
    };

    return (
        <>
            <div className="ant-modal-header">
                <Space size="middle">
                    {showBackBtn && (
                        <div className="back-link" onClick={handleBack}>
                            <ArrowLeftOutlined />
                        </div>
                    )}
                    <div className="ant-modal-title">Upload Assets</div>
                </Space>
            </div>
            <div className="asset-modal-content">
                {error && (
                    <Alert
                        message={formatError(error)}
                        type="error"
                        style={{ marginBottom: "24px" }}
                    />
                )}
                <Upload.Dragger
                    className="upload-wrapper"
                    accept={fileTypes.toString()}
                    name="files"
                    multiple={true}
                    onRemove={handleRemove}
                    beforeUpload={handleBeforeUpload}
                    fileList={files}
                >
                    <p className="ant-upload-drag-icon">
                        <CloudUploadOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area
                    </p>
                    <p className="ant-upload-hint">
                        Support for a single or multiple files
                    </p>
                    <p className="ant-upload-hint">Max file size of 8 MB</p>
                </Upload.Dragger>
            </div>
            <div className="ant-modal-footer">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" loading={loading} onClick={handleUpload}>
                    {loading ? "Uploading..." : "Upload"}
                </Button>
            </div>
        </>
    );
};

export default Uploader;
