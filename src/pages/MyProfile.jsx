import React, { useEffect, useState } from 'react';
import { Card, Avatar, Spin, Alert, Upload, Button, Form, Modal, Input, Space, notification } from 'antd';
import { changeAvatarByUser, changePasswordByUser, getAccount, updateUserByUser } from '../services/userService';
import { UploadOutlined } from '@ant-design/icons';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [isChangeAvatarModalVisible, setIsChangeAvatarModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [changeAvatarForm] = Form.useForm();
  const handleOk = async () => {
    const values = await form.validateFields();
    setLoading(true);
    let res = await updateUserByUser({
      name: values.name
    });
    if (res?.data) {
      notification.success({
        message: "Updated successfully"
      });
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
    setIsModalVisible(false)
    setLoading(false);
  };
  useEffect(() => {
    const getData = async () => {

      try {
        setLoading(true)
        const res = await getAccount();
        if (res?.data) {
          setUser(res?.data)
        }
        setLoading(false)
      } catch (error) {
        message.error('Failed to save favourite');
      }
    }
    getData();
  }, []);

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }
  const handleEdit = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      ...record,
      role: record.role.id,
    });
  };
  const handleChangePassword = () => {
    setIsChangePasswordModalVisible(true);
    changePasswordForm.resetFields();
  };

  const handleChangeAvatar = () => {
    setIsChangeAvatarModalVisible(true);
    changeAvatarForm.resetFields();
  };
  const handleChangePasswordOk = async () => {
    const values = await changePasswordForm.validateFields();
    setLoading(true);
    const res = await changePasswordByUser({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    });
    if (res?.statusCode === 200) {
      notification.success({
        message: "Password changed successfully",
      });
      setIsChangePasswordModalVisible(false);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
    setLoading(false);
  };

  const handleChangeAvatarOk = async () => {
    const values = await changeAvatarForm.validateFields();
    setLoading(true);
    const res = await changeAvatarByUser(values.avatar[0].originFileObj);
    if (res?.data) {
      notification.success({
        message: "Avatar changed successfully",
      });
      setIsChangeAvatarModalVisible(false);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChangePasswordCancel = () => {
    setIsChangePasswordModalVisible(false);
  };

  const handleChangeAvatarCancel = () => {
    setIsChangeAvatarModalVisible(false);
  };
  return (
    <>
      <Card title="User Information" style={{ width: 300, margin: '0 auto' }}>
        <Card.Meta
          avatar={<Avatar src={user?.avatar ? `http://localhost:8080/storage/avatar/${user?.avatar}` : 'https://via.placeholder.com/150'} />}
          title={user?.name}
          description={`Email: ${user?.email}`}
        />
        <p><strong>Status:</strong> {user?.enabled ? 'Enabled' : 'Disabled'}</p>
        <p><strong>Storage Quota:</strong> {(user?.storageQuota / 1024 / 1024 / 1024).toFixed(5)} GB</p>
        <p><strong>Role:</strong> {user?.role?.name}</p>
      </Card>
      <Space size="middle">
        <Button onClick={() => handleEdit()}>Edit</Button>
        <Button onClick={() => handleChangePassword()}>Change Password</Button>
        <Button onClick={() => handleChangeAvatar()} >Change Avatar</Button>
      </Space>
      <Modal
        title={"Edit User"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>

        </Form>
      </Modal>
      <Modal
        title="Change Password"
        open={isChangePasswordModalVisible}
        onOk={handleChangePasswordOk}
        onCancel={handleChangePasswordCancel}
        destroyOnClose
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
        >
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[{ required: true, message: 'Please enter the old password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: 'Please enter the new password' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Change Avatar"
        open={isChangeAvatarModalVisible}
        onOk={handleChangeAvatarOk}
        onCancel={handleChangeAvatarCancel}
        destroyOnClose
      >
        <Form
          form={changeAvatarForm}
          layout="vertical"
        >
          <Form.Item
            name="avatar"
            label="New Avatar"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: 'Please upload the new avatar' }]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>

  );
};

export default MyProfile;
