import { Col, DatePicker, Form, FormInstance, Input, Row, Select } from "antd";
import { Store } from "antd/lib/form/interface";
import moment from "moment";
import React, { useMemo } from "react";
import { AssetInput, ContentEditor } from ".";
export interface UpdateProjectFormProps {
    form?: FormInstance<any>;
    onFinish?: (values: any) => void;
    initialValues?: Store;
}

const UpdateProjectForm: React.FC<UpdateProjectFormProps> = ({
    form,
    onFinish,
    initialValues,
}) => {
    const [start, end] = useMemo(() => {
        const startDate = initialValues?.start && moment(initialValues.start);
        const endDate = initialValues?.end && moment(initialValues.end);
        return [startDate, endDate];
    }, [initialValues]);

    return (
        <Form
            form={form}
            name="update_project_form"
            className="update-project-form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
            initialValues={{ ...initialValues, project_time: [start, end] }}
        >
            <Row>
                <Col>
                    <h2 className="form-title">Details</h2>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: "Title is required.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="e.g. Project 1"
                            autoFocus
                            autoComplete="false"
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        name="slug"
                        label="Slug"
                        rules={[
                            {
                                required: true,
                                message: "Slug is required.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="e.g. project-1"
                            autoComplete="false"
                            onKeyPress={(e) => {
                                // Prevent unvalid url characters
                                const onlyUrlChars = /^[a-z0-9-_]+$/;
                                const key = String.fromCharCode(
                                    !e.charCode ? e.which : e.charCode
                                );
                                if (!onlyUrlChars.test(key)) {
                                    e.preventDefault();
                                    return false;
                                }
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[
                            {
                                required: true,
                                message: "Content is required.",
                            },
                        ]}
                    >
                        <ContentEditor />
                    </Form.Item>{" "}
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name="assets">
                        <AssetInput />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name="project_time" label="Project Timeline">
                        <DatePicker.RangePicker />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        name="link"
                        label="External Link"
                        rules={[
                            {
                                type: "url",
                                message: "This field must be a valid url.",
                            },
                        ]}
                    >
                        <Input placeholder="e.g. https://moiracms.io/projects/project-1" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name="built_with" label="Built with">
                        <Select
                            mode="tags"
                            tokenSeparators={[","]}
                            placeholder="e.g. Javascript, React, PHP"
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name="keywords" label="Keywords">
                        <Select
                            mode="tags"
                            tokenSeparators={[","]}
                            placeholder="e.g. Website, Development, Code"
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name="description" label="Description">
                        <Input placeholder="e.g. Project description" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default UpdateProjectForm;
