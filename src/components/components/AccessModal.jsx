import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Select, Form, Input, Popconfirm } from 'antd';
import { getAccess, addAccess, deleteAccess } from '../../services/itemService';
import { AccessType } from '../../ulti/AccessType';

const { Option } = Select;

const AccessModal = ({ open, setOpen, values }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [addFormVisible, setAddFormVisible] = useState(false);
    const [addForm] = Form.useForm();

    const showLoading = async () => {
        setLoading(true);
        const res = await getAccess(values.itemId);
        if (res?.data) {
            setData(res?.data?.result);
        }

       setTimeout(()=>{
        setLoading(false);
       },500)
    };

    useEffect(() => {
        if (Object.keys(values).length !== 0) {
            showLoading();
        }
    }, [values]);

    const handleDelete = async (key) => {
        await deleteAccess(key);
        showLoading();
    };

    const handleAdd = async () => {
        try {
            const formData = await addForm.validateFields();
            await addAccess(formData.accessType, formData.email, values.itemId);
            setAddFormVisible(false);
            showLoading();
            addForm.resetFields()
        } catch (errInfo) {
            console.log('Add Form Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Access Type',
            dataIndex: 'accessType',
            width: '25%',
            editable: true,
        },
        {
            title: 'User Email',
            dataIndex: ['user', 'email'],
            width: '35%',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record) => (
                <span>
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                        <Button>Delete</Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                Open Modal
            </Button>
            <Modal
                title={<p>Access Management</p>}
                open={open}
                loading={loading}
                onCancel={() => setOpen(false)}
                footer={[
                    <Button key="add" type="primary" onClick={() => setAddFormVisible(true)}>
                        Add Access
                    </Button>,
                ]}
            >
                <Table
                    bordered
                    dataSource={data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={false}
                    rowKey="id"
                />
            </Modal>

            <Modal
                title="Add Access"
                open={addFormVisible}
                onCancel={() => setAddFormVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setAddFormVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAdd}>
                        Add
                    </Button>,
                ]}
            >
                <Form form={addForm} layout="vertical" name="addAccessForm">
                    <Form.Item
                        name="email"
                        label="User Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the user email',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="accessType"
                        label="Access Type"
                        rules={[
                            {
                                required: true,
                                message: 'Please select access type',
                            },
                        ]}
                    >
                        <Select>
                            {AccessType.map((type) => (
                                <Option key={type} value={type}>
                                    {type}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AccessModal;
