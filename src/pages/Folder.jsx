import React, { useEffect, useState } from 'react';
import { notification, Space, Typography } from 'antd';
import FileList from '../components/components/FileList';
import { getAllFolder } from '../services/itemService';
import { Link, useSearchParams } from 'react-router-dom';
import { FileFilled, FolderFilled } from '@ant-design/icons';
const { Text } = Typography;
const Folder = () => {
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
    }
  ];
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    const res = await getAllFolder(page, pageSize);
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
        description:
          res.message && Array.isArray(res.message) ? res.message[0] : res.message,
        duration: 5,
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    const page = searchParams.get('page') || pagination.current;
    const size = searchParams.get('size') || pagination.pageSize;
    fetchData(Number(page), Number(size));
  }, [searchParams]);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setSearchParams({ page: current, size: pageSize });
  };
  return <>{data && <FileList columns={columns} data={data} loading={loading} pagination={pagination} onChange={handleTableChange} />}</>;
};

export default Folder;
