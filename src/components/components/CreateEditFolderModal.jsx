import { Checkbox, Form, Input, Modal, notification } from 'antd'
import React, { useState } from 'react'
import { createFolder, renameFolder } from '../../services/folderService';
import { renameFile } from '../../services/fileService';
const CreateEditFolderModal = ({ itemId, values, modalVisible, setModalVisible }) => {

    const [form] = Form.useForm();

    const handleModalCancel = () => {
        form.resetFields();
        setModalVisible(false);
    };
    const handleModalOk = async () => {
        let res;
        if (Object.keys(values).length) {
            if (values.type === 'FOLDER') {
                res = await renameFolder({
                    id: values.id,
                    public: values.public ? true : false,
                    folderName: form.getFieldValue('name')
                })
            } else if (values.type === 'FILE') {
                res = await renameFile(itemId, {
                    id: values.id,
                    public: values.public ? true : false,
                    fileName: form.getFieldValue('name')
                })
            }
        } else {
            res = await createFolder(
                form.getFieldValue('name'),
                itemId
            )
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