import React, { useState } from 'react';
import { AppstoreOutlined, FolderFilled, HistoryOutlined, HomeFilled, LikeOutlined, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { logout } from '../../services/loginService';

const Header = () => {
    const [current, setCurrent] = useState('MyDrive');
    const onClick = (e) => {
        setCurrent(e.key);
    };
    const { auth, setAuth } = useContext(AuthContext)
    const navigator = useNavigate()

    const items = [
        {
            label: <Link to={'/'}>My Drive</Link>,
            key: 'MyDrive',
            icon: <HomeFilled />
        },
        ...(auth.isAuthenticated ? [
            {
                label: <Link to={'/users'}>Users</Link>,
                key: 'Users',
                icon: <UserOutlined />
            },
            {
                label: <Link to={'/favourites'}>Favourite</Link>,
                key: 'Favourite',
                icon: <LikeOutlined />
            },
            {
                label: <Link to={'/folders'}>Folders</Link>,
                key: 'Folders',
                icon: <FolderFilled />
            },
        ] : []),
        {
            label: `Welcome ${auth?.user?.email}`,
            key: 'Authorization',
            icon: <SettingOutlined />,

            children: [

                ...(auth.isAuthenticated ? [
                    {
                        label: <span onClick={async () => {
                            const res = await logout();
                            localStorage.clear('access_token');
                            notification.success({
                                message: "Successfully",
                                description:
                                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                            });

                            setAuth({
                                isAuthenticated: false,
                                user: {
                                    email: "",
                                    name: ""
                                }
                            })
                            navigator("/")
                        }}>Logout</span>,
                        key: 'Logout',
                    },

                ] : [
                    {
                        label: <Link to={'/register'}>Register</Link>,
                        key: 'Register',
                    },
                    {
                        label: <Link to={'/login'}>Login</Link>,
                        key: 'Login',
                    },
                ]),
            ],


        }
    ];
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default Header;