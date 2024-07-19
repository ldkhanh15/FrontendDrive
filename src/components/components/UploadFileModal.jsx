import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, notification, Upload } from 'antd';
import React from 'react'
import { uploadFile } from '../../services/fileService';

const UploadFileModal = ({ uploadModalVisible, setUploadModalVisible ,itemId}) => {

    const handleUploadModalCancel = () => {
        setUploadModalVisible(false);
    };

    const handleUploadFile = async (file) => {
        const res = await uploadFile(itemId, file)
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
    return (
        <div>
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
                    showUploadList={false}
                    multiple={true}
                >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
            </Modal>
        </div>
    )
}

export default UploadFileModal