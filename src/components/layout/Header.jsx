import React, { useState } from 'react';
import { AppstoreOutlined, EyeOutlined, FolderFilled, HistoryOutlined, HomeFilled, LikeOutlined, LockFilled, MailOutlined, ProfileFilled, SettingOutlined, StarTwoTone, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
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
    console.log(auth);
    const items = [
        {
            label: <Link to={'/'}>Home</Link>,
            key: 'Home',
            icon: <HomeFilled />

        },
        ...(auth.user.role === 'ROLE_USER' ? [
            {
                label: <Link to={'/my-drive'}>My Drive</Link>,
                key: 'MyDrive',
                icon: <StarTwoTone />
            },
            {
                label: <Link to={'/favourites'}>Favourite</Link>,
                key: 'MyFavourite',
                icon: <LikeOutlined />
            },
            {
                label: <Link to={'/my-profile'}>My Profile</Link>,
                key: 'MyProfile',
                icon: <ProfileFilled />
            },
        ] : []),
        ...(auth.user.role === 'ROLE_ADMIN' ? [
            {
                label: <Link to={'/users'}>Users</Link>,
                key: 'Users',
                icon: <UserOutlined />
            },
            {
                label: <Link to={'/folders'}>Folders</Link>,
                key: 'Folders',
                icon: <FolderFilled />
            },
            {
                label: <Link to={'/roles'}>Role</Link>,
                key: 'Role',
                icon: <UserSwitchOutlined />
            },
            {
                label: <Link to={'/permissions'}>Permission</Link>,
                key: 'Permission',
                icon: <LockFilled />
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