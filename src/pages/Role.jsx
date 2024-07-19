import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message, Collapse } from 'antd';
import { createRole, deleteRole, getAllRole, updateRole } from '../services/roleService';
import { getAllPermission } from '../services/permissionService';
import { useSearchParams } from 'react-router-dom';

const { Panel } = Collapse;

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    const page = searchParams.get('page') || pagination.current;
    const size = searchParams.get('size') || pagination.pageSize;
    fetchRoles(Number(page), Number(size));
    fetchPermissions();
  }, [searchParams]);
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setSearchParams({ page: current, size: pageSize });
  };
  const fetchRoles = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await getAllRole(page, pageSize);
      if (response?.data) {
        setRoles(response.data.result);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: response.data.meta.total,
        });
      }
    } catch (error) {
      message.error('Failed to load roles');
    }
    setLoading(false);
  };

  const fetchPermissions = async () => {
    try {
      const response = await getAllPermission(1, 1000);
      setPermissions(response.data.result.map(permission => ({ ...permission, assigned: false })));
    } catch (error) {
      message.error('Failed to load permissions');
    }
  };

  const handleCreate = () => {
    setCurrentRole(null);
    form.resetFields();
    setPermissions(permissions.map(permission => ({ ...permission, assigned: false })));
    setModalVisible(true);
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    form.setFieldsValue(role);
    const updatedPermissions = permissions.map(permission => ({
      ...permission,
      assigned: role.permissions.some(rp => rp.id === permission.id),
    }));
    setPermissions(updatedPermissions);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      message.success('Role deleted');
      fetchRoles(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete role');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const role = {
        ...currentRole,
        ...values,
        permissions: permissions.filter(permission => permission.assigned),
      };
      if (currentRole) {
        await updateRole(role);
        message.success('Role updated');
      } else {
        await createRole(role);
        message.success('Role created');
      }
      setModalVisible(false);
      fetchRoles(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to save role');
    }
  };

  const togglePermission = (permissionId, checked) => {
    setPermissions(prevPermissions =>
      prevPermissions.map(permission =>
        permission.id === permissionId
          ? { ...permission, assigned: checked }
          : permission
      )
    );
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (text, record) => <Switch checked={record.active} disabled />,
    },
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

  const getPermissionsByModule = () => {
    const modules = {};
    permissions.forEach(permission => {
      const module = permission.module || 'Other';
      if (!modules[module]) {
        modules[module] = [];
      }
      modules[module].push(permission);
    });
    return modules;
  };

  return (
    <>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
        Create Role
      </Button>
      <Table
        columns={columns}
        dataSource={roles}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={currentRole ? 'Edit Role' : 'Create Role'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Collapse>
            {Object.entries(getPermissionsByModule()).map(([module, perms]) => (
              <Panel header={module} key={module}>
                {perms.map(permission => (
                  <div key={permission.id}>
                    <Switch
                      checked={permission.assigned}
                      onChange={(checked) => togglePermission(permission.id, checked)}
                    />
                    {permission.description}
                  </div>
                ))}
              </Panel>
            ))}
          </Collapse>
        </Form>
      </Modal>
    </>
  );
};

export default Role;
