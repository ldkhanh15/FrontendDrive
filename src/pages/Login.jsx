import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message, notification } from 'antd';
import { login } from '../services/loginService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';

const Login = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { setAuth } = useContext(AuthContext)

    const navigator = useNavigate();

    const onFinish = async (values) => {
        const { email, password } = values;
        // setIsSubmit(true);
        const res = await login(email, password);
        // setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            notification.success({
                message: "Successfully",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
            });
            console.log(res.data.user);
            console.log(res.data.user.role.name);
            setAuth({
                isAuthenticated: true,
                user: {
                    email: res.data.user.email,
                    name: res.data.user.name,
                    role:res.data.user.role.name
                }
            })
            navigator("/")
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }

    }

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
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
export default Login;