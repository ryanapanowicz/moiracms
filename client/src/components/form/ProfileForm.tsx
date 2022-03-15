import { Col, Form, FormInstance, Input, Row, Switch } from "antd";
import React, { useEffect, useState } from "react";
import PasswordInputs from "./PasswordInputs";
import ProfileImageInput from "./ProfileImageInput";

export interface ProfileFormProps {
    form?: FormInstance<any>;
    onFinish?: (values: any) => void;
    initialValues?: {};
    passwordToggle?: boolean;
    onToggleChange?: (checked: boolean) => void;
    imageTitle?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
    form,
    onFinish,
    initialValues,
    passwordToggle = false,
    onToggleChange,
    imageTitle,
}) => {
    const [toggle, setToggle] = useState(passwordToggle);

    useEffect(() => {
        setToggle(passwordToggle);
    }, [passwordToggle]);

    const handleToggleChange = (checked: boolean) => {
        setToggle(checked);
        typeof onToggleChange === "function" && onToggleChange(checked);
    };

    return (
        <Form
            form={form}
            name="update_user_form"
            className="update-user-form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
            initialValues={initialValues}
        >
            <Row>
                <Col>
                    <h2 className="form-title">Details</h2>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name="avatar" label="Profile Image">
                        <ProfileImageInput title={imageTitle} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col sm={24} md={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Name is required.",
                            },
                        ]}
                    >
                        <Input placeholder="e.g. Mark Paris" autoFocus />
                    </Form.Item>
                </Col>
                <Col sm={24} md={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                type: "email",
                                message: "Email address must be valid",
                            },
                            {
                                required: true,
                                message: "Email address is required.",
                            },
                        ]}
                    >
                        <Input placeholder="e.g. mark.paris@moiracms.io" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Item label="Change Password">
                        <Switch
                            checked={toggle}
                            onChange={handleToggleChange}
                        />
                    </Form.Item>
                </Col>
            </Row>
            {toggle && <PasswordInputs />}
        </Form>
    );
};

export default ProfileForm;
