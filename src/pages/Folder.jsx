import React, { useEffect, useState } from 'react';
import { Button, notification, Select, Space, Tag, Typography } from 'antd';
import FileList from '../components/components/FileList';
import { Link, useSearchParams } from 'react-router-dom';
import { FileFilled, FolderFilled } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';
import { getAllFolder } from '../services/folderService';
import ActivityModal from '../components/components/ActivityModal';
const { Text } = Typography;
const Folder = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'folderName',
      key: 'folderName',
      render: (text, record) => (
        <Space>
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
      title: 'Owner',
      dataIndex: ['user', 'name'],
      key: 'name',
      render: (name) => <Text>{name}</Text>,
    },
    {
      title: 'Owner Email',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (email) => <Text>{email}</Text>,
    },
    {
      title: 'Enabled',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (isEnabled) => {

        let tag = isEnabled ? 'true' : 'false'
        let color = isEnabled ? 'green' : 'red'

        return (
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        );

      }
    },
    {
      title: 'Deleted',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      render: (isDeleted) => {
        let tag = isDeleted === true ? 'true' : 'false'
        let color = isDeleted === true ? 'green' : 'red'

        return (
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        );

      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleActivity(record.itemId)}>Activity</Button>
        </Space>
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [itemSelected, setItemSelected] = useState(0)
  const handleActivity = (id) => {
    setItemSelected(id)
    setOpen(true)
}
  const [data, setData] = useState([]);
  const [typeItem, setTypeItem] = useState('enabled')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const fetchData = async (page, pageSize, searchQuery) => {
    setLoading(true);
    const res = await getAllFolder(page, pageSize, typeItem, searchQuery);
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
    const searchQuery = searchParams.get('name') || '';
    fetchData(Number(page), Number(size), searchQuery);
  }, [searchParams, typeItem]);

  const handleSearch = (e) => {
    setSearchParams({
      ...searchParams,
      name: e.target.value
    })
  };
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setSearchParams({
      ...searchParams,
      page: current,
      size: pageSize
    });
  };
  return <>
    <Space>
      <Select
        value={typeItem}
        style={{
          width: 120,
        }}
        onChange={(value) => setTypeItem(value)}
        options={[
          {
            value: 'enabled',
            label: 'Enabled',
          },
          {
            value: 'disabled',
            label: 'Disabled',
          },
          {
            value: 'deleted',
            label: 'Deleted',
          },

        ]}
      />
      <Search
        placeholder="Search by name"
        onChange={handleSearch}
        style={{ width: 200 }}
      />
    </Space>
    <ActivityModal itemId={itemSelected} open={open} setOpen={setOpen} />
    {data &&
      <FileList
        columns={columns}
        personal={false}
        data={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    }
  </>;
};

export default Folder;
