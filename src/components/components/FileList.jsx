import React, { useState } from 'react';
import { Table, Space, Typography, Menu, Modal, Upload, Button, notification } from 'antd';
import { FolderFilled, FileFilled, UploadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { deleteFile, deleteFolder } from '../../services/itemService';

const { Text } = Typography;

const FileList = ({ data, loading, pagination, onChange, parent, handleRightClick, itemId }) => {
  const navigate = useNavigate();

  const renderParentFolder = () => {
    if (parent) {
      return (
        <>
          <FolderFilled style={{ marginTop: 10 }} />
          <Link to={`/folders/${parent.itemId}`}>
            <Text strong>{parent.folderName}</Text>
          </Link>
        </>
      );
    }
    return null;
  };
  const handleDelete = async (type, id) => {
    let res;
    console.log(type+id);
    if (type === 'FOLDER') {
      res = await deleteFolder(id)
    } else if (type === 'FILE') {
      res = await deleteFile(itemId, id)
    }
    if (res.statusCode===200) {
      notification.success({
        message: 'Successfully',
        description:
          res.message && Array.isArray(res.message) ? res.message[0] : res.message,
      })
      
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message) ? res.message[0] : res.message,
        duration: 5,
      });
    }
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'folderName',
      key: 'folderName',
      render: (text, record) => (
        <Space onContextMenu={(e) => handleRightClick(e, record)}>
          {record.itemType === 'FOLDER' ? (
            <Link to={`/folders/${record.itemId}`}>
              <FolderFilled style={{ marginRight: 8 }} />
            </Link>
          ) : (
            <FileFilled style={{ marginRight: 8 }} />
          )}
          <Text strong={record.itemType === 'FOLDER'}>{record.itemType === 'FOLDER' ? record.folderName : record.fileName}</Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'itemType',
      key: 'itemType',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Created By',
      dataIndex: ['user', 'email'],
      key: 'createdBy',
      render: (email) => <Text>{email}</Text>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => <Text>{new Date(createdAt).toLocaleString()}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {record.itemType === 'FOLDER' ? (
            <Link to={`/folders/${record.itemId}`}>Open</Link>
          ) : (
            <a target="_blank" href={`http://localhost:8080/storage/file/${record.filePath}`}>Open</a>
          )}
          <span onClick={() => handleDelete(record.itemType, record.itemId)}>Delete</span>
        </Space>
      ),
    },
  ];

  return (
    <>
      {data && (
        <>
          {renderParentFolder()}

          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={onChange}
            rowKey="itemId"
            onRow={(record) => ({
              onDoubleClick: () => {
                if (record.itemType === 'FOLDER') {
                  navigate(`/folders/${record.itemId}`);
                } else {
                  window.open(`http://localhost:8080/storage/file/${record.filePath}`, '_blank');
                }
              },
              style: { cursor: 'pointer' },
              onContextMenu: (event) => handleRightClick(event, record),
            })}
          />



        </>
      )}
    </>
  );
};

export default FileList;
