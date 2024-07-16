import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import { getAllFavourite } from '../services/favouriteService';

const { Option } = Select;

const Favourite = () => {
  const [favourites, setFavourites] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFavourites();
    // fetchUsers();
    // fetchItems();
  }, []);

  const fetchFavourites = async () => {
    setLoading(true);
    try {
      const response = await getAllFavourite(); 
      setFavourites(response.data.result);
    } catch (error) {
      message.error('Failed to load favourite items');
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/v1/users'); // Adjust the endpoint as needed
      setUsers(response.data.data.result);
    } catch (error) {
      message.error('Failed to load users');
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/v1/items'); // Adjust the endpoint as needed
      setItems(response.data.data.result);
    } catch (error) {
      message.error('Failed to load items');
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/favourites/${id}`); // Adjust the endpoint as needed
      message.success('Favourite deleted');
      fetchFavourites();
    } catch (error) {
      message.error('Failed to delete favourite');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const favourite = {
        userId: values.userId,
        itemId: values.itemId,
      };
      await axios.post('/api/v1/favourites', favourite); // Adjust the endpoint as needed
      message.success('Favourite created');
      setModalVisible(false);
      fetchFavourites();
    } catch (error) {
      message.error('Failed to save favourite');
    }
  };

  const columns = [
    {
      title: 'Favourite ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'User Email',
      dataIndex: ['user', 'email'],
      key: 'userEmail',
    },
    {
      title: 'Item ID',
      dataIndex: ['item', 'itemId'],
      key: 'itemId',
    },
    {
      title: 'Item Type',
      dataIndex: ['item', 'itemType'],
      key: 'itemType',
    },
    {
      title: 'Folder Name',
      dataIndex: ['item', 'folderName'],
      key: 'folderName',
    },
    {
      title: 'Created At',
      dataIndex: ['item', 'createdAt'],
      key: 'createdAt',
    },
    {
      title: 'Created By',
      dataIndex: ['item', 'createdBy'],
      key: 'createdBy',
    },
    {
      title: 'Owner Email',
      dataIndex: ['item', 'user', 'email'],
      key: 'ownerEmail',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => handleDelete(record.id)} type="link" danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
        Create Favourite
      </Button>
      <Table
        columns={columns}
        dataSource={favourites}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title='Create Favourite'
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userId" label="User" rules={[{ required: true }]}>
            <Select placeholder="Select a user">
              {users.map(user => (
                <Option key={user.id} value={user.id}>{user.email}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="itemId" label="Item" rules={[{ required: true }]}>
            <Select placeholder="Select an item">
              {items.map(item => (
                <Option key={item.itemId} value={item.itemId}>{item.folderName}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Favourite;
