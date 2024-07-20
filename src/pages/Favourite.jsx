import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Select, message, Space, Tag, Typography } from 'antd';
import axios from 'axios';
import { addFavourite, deleteFavourite, getAllFavourite } from '../services/favouriteService';
import { FileFilled, FolderFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getDetailFolder } from '../services/folderService';

const { Option } = Select;
const { Text } = Typography
const Favourite = () => {
  const [favourites, setFavourites] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFavourites();
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



  const handleCreate = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFavourite(id) // Adjust the endpoint as needed
      message.success('Favourite deleted');
      fetchFavourites();
    } catch (error) {
      message.error('Failed to delete favourite');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await addFavourite({
        item: {
          id: values.itemId
        }
      });
      message.success('Favourite created');
      setModalVisible(false);
      fetchFavourites();
    } catch (error) {
      message.error('Failed to save favourite');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: ['item', 'folderName'],
      key: 'folderName',
      render: (text, record) => (
        <Space onContextMenu={(e) => handleRightClick(e, record)}>
          {record.item.itemType === 'FOLDER' ? (
            <Link to={`/folders/${record.item.itemId}`}>
              <FolderFilled style={{ marginRight: 8 }} />
            </Link>
          ) : (
            <FileFilled style={{ marginRight: 8 }} />
          )}
          <Text strong={record.itemType === 'FOLDER'}>{record.item.itemType === 'FOLDER' ? record.item.folderName : record.item.fileName}</Text>
        </Space>
      ),
    },
    {
      title: 'Owner email',
      dataIndex: ['item', 'user', 'email'],
      key: 'owner email',
      render: (email) => <Text>{email}</Text>,
    },
    {
      title: 'Created At',
      dataIndex: ['item', 'createdAt'],
      key: 'createdAt',
      render: (createdAt) => <Text>{new Date(createdAt).toLocaleString()}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {record.item.itemType === 'FOLDER' ? (
            <Link to={`/folders/${record.item.itemId}`}>Open</Link>
          ) : (
            <a target="_blank" href={`http://localhost:8080/storage/file/${record.item.filePath}`}>Open</a>
          )}
          <span onClick={() => handleDelete(record.id)}>Delete</span>
        </Space>
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
