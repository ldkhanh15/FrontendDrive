import React, { useEffect, useState } from 'react';
import { notification, Space, Table, Tag } from 'antd';
import { getUser } from '../services/userService';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const User = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async (page, pageSize) => {
    setLoading(true);
    const res = await getUser(page, pageSize);
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


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'N/A', // Show 'N/A' if name is null
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
      dataIndex: ['role', 'name'], // Nested property access
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];


  return <Table
    columns={columns}
    dataSource={data}
    loading={loading}
    pagination={pagination}
    onChange={handleTableChange}
  />
};
export default User;