import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { getAllPermission, createPermission, updatePermission, deletePermission } from '../services/permissionService';
import { useSearchParams } from 'react-router-dom';

const PermissionComponent = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPermission, setCurrentPermission] = useState(null);
    const [form] = Form.useForm();
    const [searchParams, setSearchParams] = useSearchParams();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    useEffect(() => {
        const page = searchParams.get('page') || pagination.current;
        const size = searchParams.get('size') || pagination.pageSize;
        console.log(page+' '+size);
        fetchPermissions(Number(page), Number(size));
    }, [searchParams]);

    const fetchPermissions = async (page, pageSize) => {
        setLoading(true);
        const res = await getAllPermission(page, pageSize);
        if (res?.data?.result) {
            setPermissions(res.data.result);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: res.data.meta.total,
            });
        }

        setLoading(false);
    };

    const handleCreate = () => {
        setCurrentPermission(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setCurrentPermission(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deletePermission(id);
            message.success('Permission deleted');
            fetchPermissions(pagination.current,pagination.pageSize);
        } catch (error) {
            message.error('Failed to delete permission');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (currentPermission) {
                await updatePermission({ ...currentPermission, ...values });
                message.success('Permission updated');
            } else {
                await createPermission(values);
                message.success('Permission created');
            }
            setModalVisible(false);
            fetchPermissions(pagination.current,pagination.pageSize);
        } catch (error) {
            message.error('Failed to save permission');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'API Path', dataIndex: 'apiPath', key: 'apiPath' },
        { title: 'Method', dataIndex: 'method', key: 'method' },
        { title: 'Module', dataIndex: 'module', key: 'module' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleEdit(record)} type="link">Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} type="link" danger>Delete</Button>
                </>
            ),
        },
    ];
    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;
        setSearchParams({ page: current, size: pageSize });
    };
    return (
        <>
            <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
                Create Permission
            </Button>
            <Table
                columns={columns}
                dataSource={permissions}
                loading={loading}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
            />
            <Modal
                title={currentPermission ? 'Edit Permission' : 'Create Permission'}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="apiPath" label="API Path" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="method" label="Method" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="module" label="Module">
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Name">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default PermissionComponent;
