import React, { useEffect, useState } from 'react';
import { Button, Drawer, Spin, Tree, message } from 'antd';
import { getActivity } from '../../services/activityService';

const ActivityModal = ({ itemId, open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState([]);

    const showLoading = async () => {
        setOpen(true);
        setLoading(true);
        try {
            const res = await getActivity(itemId);
            console.log(res);
            setTreeData(convertToTreeData(res.data.result));
        } catch (error) {
            message.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (itemId && open) {
            showLoading();
        }
    }, [itemId, open]);

    const convertToTreeData = (activities) => {
        const getItemName = (item) => {
            return item.itemType === 'FOLDER' ? item.folderName : item.fileName;
        };
        
        return activities.map((activity) => ({
            title: `${activity.activityType} - ${activity.item.itemType} - ${getItemName(activity.item)}`,
            key: activity.id,
            children: activity.subActivity.map((sub) => ({
                title: `${sub.activityType} - ${sub.item.itemType} - ${getItemName(sub.item)}`,
                key: sub.id,
                children: sub.subActivity.map((subSub) => ({
                    title: `${subSub.activityType} - ${getItemName(subSub.item)}`,
                    key: subSub.id,
                })),
            })),
        }));
    };
    

    return (
        <>
            <Drawer
                closable
                destroyOnClose
                title="Activity Drawer"
                placement="right"
                open={open}
                onClose={() => setOpen(false)}
                width={400}
            >
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Tree
                        treeData={treeData}
                        defaultExpandAll
                    />
                )}
                <Button
                    type="primary"
                    style={{
                        marginBottom: 16,
                        marginTop: 16,
                    }}
                    onClick={showLoading}
                >
                    Reload
                </Button>
            </Drawer>
        </>
    );
};

export default ActivityModal;
