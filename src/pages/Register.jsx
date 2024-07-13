import React from 'react';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { register } from '../services/loginService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigator = useNavigate();
    const onFinish = async (values) => {
        const { email, password,name } = values;
        const res=await register(
            email,password,name
        );
        if(res && res.data ){
            notification.success({
                message: "Successfully",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
            });
            navigator("/login")
        }else{
            notification.error({
                message: "Error",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
            });
        }
    };

    return (
        <div style={{ margin: 50 }}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
                autoComplete="onl"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',

                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
export default Register;