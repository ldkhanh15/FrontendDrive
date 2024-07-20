import React, { useEffect, useState } from 'react';
import { notification, Space, Table, Modal, Button, Form, Input, Select, Upload } from 'antd';
import { getUser, createUser, updateUser, deleteUser, changePassword, changeAvatar, bulkCreate, activateUser, deactivateUser } from '../services/userService';
import { useSearchParams } from 'react-router-dom';
import { getAllRole } from '../services/roleService';
import Search from 'antd/es/transfer/search';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const User = () => {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [type, setType] = useState('enabled');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [isChangeAvatarModalVisible, setIsChangeAvatarModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [changeAvatarForm] = Form.useForm();

  const fetchData = async (page, pageSize, searchQuery) => {
    setLoading(true);
    const res = await getUser(page, pageSize, type, searchQuery);
    if (res?.data?.result) {
      setData(res.data.result);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: res.data.meta.total,
      });
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }

    const resRole = await getAllRole(1, 100);
    if (resRole?.data?.result) {
      setRoles(resRole.data.result);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: resRole.message,
        duration: 5,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const page = searchParams.get('page') || pagination.current;
    const size = searchParams.get('size') || pagination.pageSize;
    const searchQuery = searchParams.get('name') || '';
    fetchData(Number(page), Number(size), searchQuery);
  }, [searchParams, type]);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setSearchParams({
      ...searchParams,
      page: current,
      size: pageSize
    });
  };

  const handleCreate = () => {
    setCurrentUser(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setCurrentUser(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...record,
      role: record.role.id,
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const res = await deleteUser(id);
    if (res?.data) {
      notification.success({
        message: "Deleted successfully",
      });
      fetchData(pagination.current, pagination.pageSize);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
    setLoading(false);
  };
  const handleActive = async (id) => {
    setLoading(true);
    const res = await activateUser(id);
    if (res?.statusCode === 200) {
      notification.success({
        message: "Active successfully",
      });
      fetchData(pagination.current, pagination.pageSize);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
    setLoading(false);
  };
  const handleDeActive = async (id) => {
    setLoading(true);
    const res = await deactivateUser(id);
    if (res?.statusCode === 200) {
      notification.success({
        message: "DeActive successfully",
      });
      fetchData(pagination.current, pagination.pageSize);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
    setLoading(false);
  };

  const handleChangePassword = (record) => {
    setCurrentUser(record);
    setIsChangePasswordModalVisible(true);
    changePasswordForm.resetFields();
  };

  const handleChangeAvatar = (record) => {
    setCurrentUser(record);
    setIsChangeAvatarModalVisible(true);
    changeAvatarForm.resetFields();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    setLoading(true);
    let res;
    if (currentUser) {
      res = await updateUser({
        id: currentUser.id,
        name: values.name,
        email: values.email,
        role: {
          id: values.role
        }
      });
    } else {
      res = await createUser({
        name: values.name,
        email: values.email,
        role: {
          id: values.role
        }
      });
    }
    if (res?.data) {
      notification.success({
        message: currentUser ? "Updated successfully" : "Created successfully",
      });
      fetchData(pagination.current, pagination.pageSize);
      setIsModalVisible(false);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
    setLoading(false);
  };

  const handleChangePasswordOk = async () => {
    const values = await changePasswordForm.validateFields();
    setLoading(true);
    const res = await changePassword(currentUser.id, {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    });
    if (res?.statusCode === 200) {
      notification.success({
        message: "Password changed successfully",
      });
      setIsChangePasswordModalVisible(false);
      fetchData(pagination.current, pagination.pageSize);
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
    const res = await changeAvatar(currentUser.id, values.avatar[0].originFileObj);
    if (res?.data) {
      notification.success({
        message: "Avatar changed successfully",
      });
      setIsChangeAvatarModalVisible(false);
      fetchData(pagination.current, pagination.pageSize);
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

  const handleSearch = (e) => {
    setSearchParams({
      ...searchParams,
      name: e.target.value
    })
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (<span>{enabled ? 'true' : 'false'}</span>)
    },
    {
      title: 'StorageQuota',
      dataIndex: 'storageQuota',
      key: 'storageQuota',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => (avatar ? <img src={`http://localhost:8080/storage/avatar/${avatar}`} alt="Avatar" style={{ width: 50, height: 50 }} /> : 'No Avatar'),
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleChangePassword(record)}>Change Password</Button>
          <Button onClick={() => handleChangeAvatar(record)} >Change Avatar</Button>
          <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
          <Button onClick={() => handleActive(record.id)}>Active</Button>
          <Button onClick={() => handleDeActive(record.id)} danger>DeActive</Button>
        </Space>
      ),
    },
  ];

  const handleBulkCreate = async ({ file }) => {
    setLoading(true);
    const res = await bulkCreate(file);
    if (res?.data) {
      notification.success({
        message: "Users created successfully",
      });
      fetchData(pagination.current, pagination.pageSize);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
        duration: 5,
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
        Add User
      </Button>
      <Upload customRequest={handleBulkCreate} accept=".csv">
        <Button icon={<UploadOutlined />}>Bulk Create Users</Button>
      </Upload>
      <Space>
        <Select
          value={type}
          style={{
            width: 120,
          }}
          onChange={(value) => setType(value)}
          options={[
            {
              value: 'enabled',
              label: 'Enabled',
            },
            {
              value: 'disabled',
              label: 'Disabled',
            },
          ]}
        />
        <Search
          placeholder="Search by name"
          onChange={handleSearch}
          style={{ width: 200 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={data.map(item => ({ ...item, key: item.id }))}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={currentUser ? "Edit User" : "Create User"}
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
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter the email' }]}
          >
            <Input />
          </Form.Item>
          {!currentUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter the password' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select the role' }]}
          >
            <Select>
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>{role.name}</Option>
              ))}
            </Select>
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

export default User;
