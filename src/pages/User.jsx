import React, { useEffect, useState } from 'react';
import { notification, Space, Table, Tag } from 'antd';
import { getUser } from '../services/userService';

const User = () => {
  const  [data,setData]=useState([]);
  useEffect(()=>{
    const getData=async ()=>{
      const res=await getUser();
      console.log(res);
      if(res?.data){
        setData(res.data.result)
      }else{
        notification.error({
          message: "Có lỗi xảy ra",
          description:
              res.message && Array.isArray(res.message) ? res.message[0] : res.message,
          duration: 5
      })
      }
    }
    getData();
  },[])



  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
        title:'Avatar',
        dataIndex:'avatar',
        key:'avatar'
    },
    {
      title: 'Role',
      dataIndex: 'role',
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
  

  return <Table columns={columns} dataSource={data} />
};
export default User;