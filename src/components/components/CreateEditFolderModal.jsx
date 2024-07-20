import { Checkbox, Form, Input, Modal, notification } from 'antd'
import React, { useContext, useState } from 'react'
import { createFolder, createFolderByUser, renameFolder, renameFolderByUser } from '../../services/folderService';
import { renameFile, renameFileByUser } from '../../services/fileService';
import { AuthContext } from '../context/auth.context';
const CreateEditFolderModal = ({ itemId, values, modalVisible, setModalVisible }) => {

    const [form] = Form.useForm();
    const { auth } = useContext(AuthContext)
    const handleModalCancel = () => {
        form.resetFields();
        setModalVisible(false);
    };
    const handleModalOk = async () => {
        let res;
        if (Object.keys(values).length) {
            if (auth.user.role === 'ROLE_ADMIN') {
                if (values.type === 'FOLDER') {
                    res = await renameFolder(itemId,{
                        id: values.id,
                        public: form.getFieldValue('public') ? true : false,
                        folderName: form.getFieldValue('name')
                    })
                } else if (values.type === 'FILE') {
                    res = await renameFile(itemId, values.id, {
                        public: form.getFieldValue('public') ? true : false,
                        fileName: form.getFieldValue('name')
                    })
                }
            } else {
                if (values.type === 'FOLDER') {

                    res = await renameFolderByUser(itemId,{
                        id: values.id,
                        public: form.getFieldValue('public') ? true : false,
                        folderName: form.getFieldValue('name')
                    })
                } else if (values.type === 'FILE') {
                    res = await renameFileByUser(itemId, values.id, {
                        public: form.getFieldValue('public') ? true : false,
                        fileName: form.getFieldValue('name')
                    })
                }
            }

        } else {
            if (auth.user.role === 'ROLE_ADMIN') {
                res = await createFolder(itemId, {
                    folderName: form.getFieldValue('name'),
                    enabled: true,
                    public: true,
                    parent: {
                        id: itemId
                    }
                })
            } else {
                res = await createFolderByUser(itemId, {
                    folderName: form.getFieldValue('name'),
                    enabled: true,
                    public: true,
                    parent: {
                        id: itemId
                    }
                })
            }
        }


        if (res?.statusCode === 200) {
            notification.success({
                message: 'Successfully',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
            })
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res?.message && Array.isArray(res?.message) ? res?.message[0] : res?.message,
                duration: 5,
            });
        }
    };
    return (
        <div>
            <Modal
                title="Create/Edit Folder"
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter folder name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="public" label="Public ?" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default CreateEditFolderModal