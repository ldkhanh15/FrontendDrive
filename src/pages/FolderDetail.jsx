import React, { useEffect, useState } from 'react';
import { Typography, Button, Form, Input, Menu, Modal, notification, Select, Space, Upload, Checkbox, Tag } from 'antd';
import FileList from '../components/components/FileList';
import { createFolder, deleteFile, deleteFolder, deleteSoftFile, deleteSoftFolder, getDetailFolder, renameFolder, restoreFile, restoreFolder, uploadFile } from '../services/itemService';
import { Link, useParams } from 'react-router-dom';
import { FileFilled, FolderFilled, UploadOutlined } from '@ant-design/icons';
import UploadFileModal from '../components/components/UploadFileModal';
import CreateEditFolderModal from '../components/components/CreateEditFolderModal';
import ActivityModal from '../components/components/ActivityModal';
import AccessModal from '../components/components/AccessModal';

const { Text } = Typography;

const FolderDetail = () => {
    const [data, setData] = useState({
        item: [],
        parent: {},
        itemId: 0
    });
    const [typeItem, setTypeItem] = useState('enabled')
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const fetchData = async () => {
        setLoading(true);
        const res = await getDetailFolder(id, typeItem);
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

    const handleMenuClick = (e) => {
        const { record } = contextMenu;

        if (e.key === 'upload') {
            setUploadModalVisible(true);
        } else if (e.key === 'newFolder') {
            setValues({})
            setModalVisible(true)
        }
        setContextMenu({ ...contextMenu, visible: false });
    };
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        fetchData();
    }, [id, typeItem]);

    const [values, setValues] = useState({
        itemId: 0,
        name: '',
        public: false,
        type: '',
        id: 0
    })
    const handleRestore = async (type, id) => {
        let res;

        if (type === 'FOLDER') {
            res = await restoreFolder(id)
        } else if (type === 'FILE') {
            res = await restoreFile(itemId, id)
        }

        if (res.statusCode === 200) {
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
        fetchData()
    }
    const handleDelete = async (type, id) => {
        let res;
        if (typeItem === 'disabled') {
            if (type === 'FOLDER') {
                res = await deleteFolder(id)
            } else if (type === 'FILE') {
                res = await deleteFile(data.itemId, id)
            }
        } else if (typeItem === 'enabled') {
            if (type === 'FOLDER') {
                res = await deleteSoftFolder(id)
            } else if (type === 'FILE') {
                res = await deleteSoftFile(data.itemId, id)
            }
        }
        if (res.statusCode === 200) {
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
        fetchData()
    }
    const handleAccess = (id, type) => {
        setDataAccess({
            itemId: id,
            type: type
        })
        setOpenAccess(true)
    }
    const handleActivity = (id) => {
        setItemSelected(id)
        setOpen(true)
    }
    const handleRename = (type, id) => {
        setValues({
            ...data,
            type: type,
            id: id
        })
        setModalVisible(true)
    }

    const handleCreateFolder = () => {
        setValues({})
        setModalVisible(true)
    }

    const handleTableChange = (pagination) => {

    };
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
            title: 'Public',
            key: 'isPublic',
            dataIndex: 'isPublic',
            render: (isPublic) => {

                let tag = isPublic ? 'true' : 'false'
                let color = isPublic ? 'green' : 'red'

                return (
                    <Tag color={color} key={tag}>
                        {tag.toUpperCase()}
                    </Tag>
                );

            }
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
                    {
                        typeItem !== 'deleted' ? <span onClick={() => handleDelete(record.itemType, record.itemId)}>Delete</span> : null
                    }
                    {
                        typeItem === 'enabled' ? <span onClick={() => handleRename(record.itemType, record.itemId)}>Rename</span> : null

                    }
                    {
                        typeItem === 'disabled' ? <span onClick={() => handleRestore(record.itemType, record.itemId)}>Restore</span> : null
                    }
                    {
                        record.itemType === 'FOLDER' ? <span onClick={() => handleActivity(record.itemId)}>Activity</span> : null
                    }
                    <span onClick={() => handleAccess(record.itemId, record.itemType)}>Access</span>
                </Space>
            ),
        },
    ];

    const [open, setOpen] = useState(false);
    const [itemSelected, setItemSelected] = useState(0)
    const [openAccess, setOpenAccess] = useState(false)
    const [dataAccess, setDataAccess] = useState({})
    return <>
        <div>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
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
            </Space>
        </div>

        {
            data.item !== null && data.itemId !== null &&
            <FileList columns={columns} itemId={data.itemId} handleRightClick={handleRightClick} data={data.item} parent={data.parent} current={data.itemId} loading={loading} pagination={pagination} onChange={handleTableChange} />
        }
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
                <Menu.Item key="upload" >Upload a file</Menu.Item>
            </Menu>
        )}
        <CreateEditFolderModal values={values} itemId={data.itemId} modalVisible={modalVisible} setModalVisible={setModalVisible} />
        <UploadFileModal itemId={data.itemId} uploadModalVisible={uploadModalVisible} setUploadModalVisible={setUploadModalVisible} />
        <ActivityModal itemId={itemSelected} open={open} setOpen={setOpen} />
        <AccessModal values={dataAccess} open={openAccess} setOpen={setOpenAccess} />
    </>;
};

export default FolderDetail;
