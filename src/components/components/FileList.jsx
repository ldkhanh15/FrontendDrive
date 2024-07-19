import React from 'react';
import { Table, Typography } from 'antd';
import { FolderFilled } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const FileList = ({ personal, columns, data, loading, pagination, onChange, parent, handleRightClick }) => {
  const navigate = useNavigate();
  const renderParentFolder = () => {
    if (parent) {
      return (
        <>
          <FolderFilled style={{ marginTop: 10 }} />
          <Link to={`/folders/${parent.itemId}`}>
            <Text strong>{parent.folderName}</Text>
          </Link>
        </>
      );
    }
    return null;
  };



  return (
    <>
      {data && (
        <>
          {renderParentFolder()}

          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={onChange}
            rowKey="itemId"
            onRow={(record) => ({
              onDoubleClick: () => {
                if (record.itemType === 'FOLDER') {
                  if (personal === true) {
                    navigate(`/my-drive/${record.itemId}`);
                  } else {
                    navigate(`/folders/${record.itemId}`);
                  }
                } else {
                  window.open(`http://localhost:8080/storage/file/${record.filePath}`, '_blank');
                }
              },
              style: { cursor: 'pointer' },
              onContextMenu: (event) => handleRightClick(event, record),
            })}
          />



        </>
      )}
    </>
  );
};

export default FileList;
