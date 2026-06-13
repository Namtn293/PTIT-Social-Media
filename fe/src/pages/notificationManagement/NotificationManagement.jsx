import React, {useState, useEffect} from "react";
import { Button, Input, Table, Popconfirm, Flex } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import NoticeCreate from "../../components/noticeCreate/noticeCreate";
import notificationApi from "../../api/NotificationApi";
import "../admin-common.css";

function NotificationManagement(){
    const [notifications, setNotifications] = useState([]);

    const loadNotifications = async () => {
        try {
            const res = await notificationApi.getAllNotifications();
            if (res.data && res.data.data) {
                setNotifications(res.data.data);
            }
        } catch (err) {
            console.error("Lỗi tải thông báo:", err);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const [searchText, setSearchText] = useState("");
    const [popup, setPopup] = useState(false);
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const columns = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            render: (text, record, index) => (currentPage - 1) * 7 + index + 1
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            width: 150
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
        },
        {
            title: "Người nhận",
            dataIndex: "userName",
            key: "userName",
            width: 150,
            render: (recipient) => {
                return recipient === "Tất cả mọi người" ? (
                    <span style={{ fontWeight: "600", color: "#1890ff" }}>Tất cả mọi người</span>
                ) : (
                    recipient
                );
            }
        },
        {
            title: "Ngày gửi",
            dataIndex: "createAt",
            key: "createAt",
            width: 180,
            render: (date)=>{
                return new Date(date).toLocaleString("vi-VN",{
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })
            }
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            width: 100,
            render: (_,record)=>{
                return (
                    <Popconfirm
                        title="Bạn có chắc muốn xóa không?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button 
                            danger 
                            icon={<DeleteOutlined />} 
                        />
                    </Popconfirm>
                )
            }
        },
    ];

    const handleSaveData = async (notice)=>{
        try {
            await notificationApi.createNotification(notice);
            loadNotifications();
        } catch (err) {
            console.error("Lỗi tạo thông báo:", err);
        }
    }

    const handleDelete = async (id)=>{
        try {
            await notificationApi.deleteNotification(id);
            loadNotifications();
        } catch (err) {
            console.error("Lỗi xóa thông báo:", err);
        }
    }

    const filteredNotifications = notifications.filter((notice) => {
        return (
            (notice.title || "").toLowerCase().includes(searchText.toLowerCase()) ||
            (notice.content || "").toLowerCase().includes(searchText.toLowerCase())
        );
    });

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <div className="admin-search-wrap">
                    <Input 
                        onChange={(e) => setSearchText(e.target.value)} 
                        size="large" 
                        style={{ width: "400px" }} 
                        placeholder="Tìm kiếm thông báo..." 
                    />
                    <Button 
                        icon={<SearchOutlined />} 
                        size="large" 
                        type="primary"
                    >
                        Tìm kiếm
                    </Button>
                </div>

                <Button 
                    icon={<PlusOutlined />}
                    size="large" 
                    type="primary" 
                    onClick={() => setPopup(true)}
                >
                    Thêm thông báo
                </Button>
                {popup && (
                    <NoticeCreate 
                        onClose={() => setPopup(false)}
                        onSubmit={handleSaveData}
                    />
                )}
            </div>
            
            <div className="admin-page-card">
                <Table 
                    columns={columns}
                    dataSource={filteredNotifications}
                    rowKey="id"
                    scroll={{ x: "max-content" }} 
                    pagination={{
                        current: currentPage,
                        pageSize: 7,
                        onChange: (page) => setCurrentPage(page),
                        position: ["bottomCenter"],
                        showLessItems: true,
                        showSizeChanger: false
                    }}
                />
            </div>
        </div>
    );
}
export default NotificationManagement;