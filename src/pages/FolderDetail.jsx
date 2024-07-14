import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Menu, Modal, notification, Upload } from 'antd';
import FileList from '../components/components/FileList';
import { createFolder, getDetailFolder, uploadFile } from '../services/itemService';
import { useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';

const FolderDetail = () => {
    const [data, setData] = useState({
        item: [],
        parent: {},
        itemId: 0
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const fetchData = async () => {
        setLoading(true);
        const res = await getDetailFolder(id);
        if (res?.data) {
            const sub = res?.data?.subFolders || []
            const files = res?.data?.files || [];
            const parent = res?.data?.parent || {}
            const itemId = res?.data?.itemId || 0
            setData({
                item: [
                    ...sub,
                    ...files
                ],
                parent: parent,
                itemId: itemId
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
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, record: null });

    const handleRightClick = (event, record) => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            record: record,
        });
    };
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const handleMenuClick = (e) => {
        const { record } = contextMenu;

        if (e.key === 'upload') {
            setUploadModalVisible(true);
        } else if (e.key === 'newFolder') {
            setModalVisible(true)
        }
        setContextMenu({ ...contextMenu, visible: false });
    };
    const handleUploadModalCancel = () => {
        setUploadModalVisible(false);
    };

    const handleUploadFile = async (file) => {
        console.log(file);
        const res = await uploadFile(data.itemId, file)
        if (res?.data) {
            notification.success({
                message: 'Successfully',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
            })
            fetchData();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
        setUploadModalVisible(false);

    };
    useEffect(() => {
        fetchData();
    }, [id]);
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const handleCreateFolder = () => {
        setModalVisible(true);
    };

    const handleModalOk = async () => {
        const res = await createFolder(form.getFieldValue('name'), data.itemId)
        if (res && res.data) {
            notification.success({
                message: 'Successfully',
                description: res.message
            })
        } else {
            notification.error({
                message: 'Error',
                description: res.message
            })
        }
        setModalVisible(false);
        fetchData();
    };

    const handleModalCancel = () => {
        form.resetFields();
        setModalVisible(false);
    };
    const handleTableChange = (pagination) => {

    };
    return <>
        <div>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
        </div>
        {
            data.item !== null && data.itemId !== null &&
            <FileList itemId={data.itemId} handleRightClick={handleRightClick} data={data.item} parent={data.parent} current={data.itemId} loading={loading} pagination={pagination} onChange={handleTableChange} />
        }
        <Modal
            title="Create/Edit Folder"
            open={modalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
        >
            <Form form={form}>
                <Form.Item
                    label="Folder Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter folder name' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
        {contextMenu.visible && (
            <Menu
                style={{
                    position: 'absolute',
                    top: contextMenu.y,
                    left: contextMenu.x,
                }}
                onClick={handleMenuClick}
            >
                <Menu.Item key="newFolder">Add new folder</Menu.Item>
                <Menu.Item key="upload">Upload a file</Menu.Item>
            </Menu>
        )}
        <Modal
            title="Upload File"
            open={uploadModalVisible}
            onCancel={handleUploadModalCancel}
            footer={null}
        >
            <Upload
                customRequest={(options) => {
                    handleUploadFile(options.file)
                }}
                showUploadList={true}
                multiple={true}
            >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </Modal>
    </>;
};

export default FolderDetail;
