import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import FileList from '../components/components/FileList';
import { getAllFolder } from '../services/itemService';
import { useSearchParams } from 'react-router-dom';

const Folder = () => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const fetchData = async (page,pageSize) => {
    setLoading(true);
    const res = await getAllFolder(page,pageSize);
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
  return <>{data && <FileList data={data} loading={loading} pagination={pagination} onChange={handleTableChange}/>}</>;
};

export default Folder;
