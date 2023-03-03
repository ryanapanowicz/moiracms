import {
    ArrowLeftOutlined,
    DeleteOutlined,
    FileOutlined
} from "@ant-design/icons";
import { FetchResult } from "@apollo/client";
import { Button, Col, Form, Input, Popconfirm, Row, Space, Spin } from "antd";
import copy from "copy-to-clipboard";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useAssetLazyQuery, useUpdateAssetInfoMutation } from "../../graphql";
import useDeleteAssetMutation, {
    DeleteAssetType
} from "../../graphql/mutations/useDeleteAssetMutation";
import { UpdateAssetInfoType } from "../../graphql/mutations/useUpdateAssetInfoMutation";
import { useNotify } from "../../hooks";
import { Can, PaginatorContext } from "../../services";
import { formatBytes, formatError } from "../../utils";

export interface EditorProps {
    uid?: string;
    status?: (working: boolean) => void;
    showBackBtn?: boolean;
    onBack?: (event: React.MouseEvent) => void;
    onCancel?: (event?: React.MouseEvent) => void;
    onSave?: (
        data: FetchResult<
            UpdateAssetInfoType,
            Record<string, any>,
            Record<string, any>
        >
    ) => void;
    onDelete?: (
        data: FetchResult<
            DeleteAssetType,
            Record<string, any>,
            Record<string, any>
        >
    ) => void;
}

const Editor: React.FC<EditorProps> = ({
    uid,
    status,
    showBackBtn = false,
    onBack,
    onCancel,
    onSave,
    onDelete,
}) => {
    const { setVariables } = useContext(PaginatorContext);
    const notify = useNotify();
    const [assetQuery, { data, error: queryError }] = useAssetLazyQuery();
    const [updateAssetInfo, { error: updateError }] =
        useUpdateAssetInfoMutation();
    const [deleteAsset, { error: deleteError }] = useDeleteAssetMutation({
        update: (cache, { data }) => {
            cache.evict({
                id: cache.identify({
                    __typename: "Media",
                    id: data?.deleteAsset?.asset.id,
                }),
            });
        },
        onQueryUpdated(observableQuery) {
            const { data } = observableQuery.getCurrentResult();
            const variables = { ...observableQuery.variables };

            if (observableQuery.queryName === "assets" && data) {
                const { currentPage, count } = data.assets.paginatorInfo;
                variables.page = currentPage;

                // If last item in current page, move down a page.
                if (currentPage > 1 && count === 1) {
                    variables.page = currentPage - 1;
                }

                setVariables("assets", variables);

                return observableQuery.refetch(variables);
            }

            return false;
        },
    });

    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (uid) {
            setSubmitting(true);

            assetQuery({ variables: { id: uid } }).then(({ data }) => {
                setSubmitting(false);

                if (!data?.asset) {
                    notify.error({
                        message: "Error",
                        description: `Asset ${uid} does not exist`,
                    });

                    typeof onCancel === "function" && onCancel();
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid]);

    // Handle error notifications
    useEffect(() => {
        const errors = [queryError, updateError, deleteError];
        errors.forEach(
            (error) =>
                error &&
                notify.error({
                    message: "Error",
                    description: formatError(error),
                })
        );
    }, [queryError, updateError, deleteError]);

    useEffect(() => {
        typeof status === "function" && status(submitting);
    }, [status, submitting]);

    const handleCopy = () => {
        if (data) {
            if (copy(data?.asset.url)) {
                notify.success({
                    message: "Success",
                    description: `Asset url added to clipboard`,
                });
            }
        }
    };

    const handleSave = (event: React.MouseEvent<HTMLElement>) => {
        form.submit();
    };

    const handleFinish = (values: any) => {
        if (!submitting && data?.asset) {
            setSubmitting(true);

            updateAssetInfo({
                variables: { id: data?.asset.id, ...values },
            }).then((response) => {
                setSubmitting(false);

                typeof onSave === "function" && onSave(response);
            });
        }
    };

    const handleDelete = () => {
        if (!submitting && data?.asset) {
            setSubmitting(true);

            return deleteAsset({
                variables: { id: data?.asset.id },
            }).then((response) => {
                setSubmitting(false);

                typeof onDelete === "function" && onDelete(response);
            });
        }
    };

    const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
        !submitting && typeof onCancel === "function" && onCancel(event);
    };

    const handleBack = (event: React.MouseEvent<HTMLElement>) => {
        !submitting && typeof onBack === "function" && onBack(event);
    };

    if (!data?.asset) {
        return (
            <div className="asset-modal-content">
                <div className="modal-spin-container">
                    <Spin />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="ant-modal-header">
                <Space size="middle">
                    {showBackBtn && (
                        <div className="back-link" onClick={handleBack}>
                            <ArrowLeftOutlined />
                        </div>
                    )}
                    <div className="ant-modal-title">Media Asset</div>
                </Space>
            </div>
            <div className="asset-modal-content">
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <div className="asset-frame">
                            {data?.asset.url ? (
                                <img
                                    src={data?.asset.url}
                                    alt={data?.asset.alternative_text}
                                    draggable="false"
                                />
                            ) : (
                                <div className="asset-item-preview">
                                    <FileOutlined className="asset-item-icon" />
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="asset-info">
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <em className="asset-info-title">Date</em>
                                    <p className="asset-info-description">
                                        {data?.asset &&
                                            dayjs(
                                                data?.asset.created_at
                                            ).format("MMM Do, YYYY")}
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <em className="asset-info-title">Size</em>
                                    <p className="asset-info-description">
                                        {data?.asset &&
                                            formatBytes(data?.asset.size)}
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <em className="asset-info-title">
                                        File type
                                    </em>
                                    <p className="asset-info-description">
                                        {data?.asset && data?.asset.mime_type}
                                    </p>
                                </Col>
                            </Row>
                        </div>
                        <Form layout="vertical">
                            <Form.Item name="url" label="URL">
                                <Input.Group compact>
                                    <Input
                                        style={{ width: "80%" }}
                                        defaultValue={data?.asset.url}
                                        readOnly
                                    />
                                    <Button
                                        style={{ width: "20%" }}
                                        type="primary"
                                        onClick={handleCopy}
                                    >
                                        Copy
                                    </Button>
                                </Input.Group>
                            </Form.Item>
                        </Form>
                        <Form
                            form={form}
                            onFinish={handleFinish}
                            name="edit_asset_form"
                            className="edit-asset-form"
                            layout="vertical"
                            requiredMark="optional"
                            initialValues={{
                                name: data?.asset.name,
                                alternative_text: data?.asset.alternative_text,
                                caption: data?.asset.caption,
                            }}
                        >
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "File Name",
                                    },
                                ]}
                            >
                                <Input autoFocus />
                            </Form.Item>
                            <Form.Item
                                name="alternative_text"
                                label="Alternative text"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="caption"
                                label="Caption"
                                style={{ marginBottom: 0 }}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
            <div className="ant-modal-footer">
                <Can do="delete" on="assets">
                    <Popconfirm
                        title="Are you sure you want to delete this Asset?"
                        icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={handleDelete}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Can>
                <Button onClick={handleCancel}>Cancel</Button>
                <Can do="edit" on="assets">
                    <Button type="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Can>
            </div>
        </>
    );
};

export default Editor;
