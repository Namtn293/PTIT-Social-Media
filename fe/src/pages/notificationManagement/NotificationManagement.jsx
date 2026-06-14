import React, { useState, useEffect } from "react";
import { Button, Input, Table, Popconfirm, Flex, Typography } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import NoticeCreate from "../../components/noticeCreate/noticeCreate";
import notificationApi from "../../api/NotificationApi";
import "../admin-common.css";

const { Paragraph } = Typography;

const ExpandableContent = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const contentRef = React.useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        if (contentRef.current) {
            // If the scrollHeight is greater than line-height * 2 (~44px), it overflows
            if (contentRef.current.scrollHeight > 46) {
                setIsOverflowing(true);
            }
        }
    }, [text]);

    return (
        <div
            onClick={() => isOverflowing && setExpanded(!expanded)}
            style={{ cursor: isOverflowing ? 'pointer' : 'default', width: '100%' }}
        >
            <div
                ref={contentRef}
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: expanded ? 'unset' : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '22px'
                }}
            >
                {text}
            </div>
            {isOverflowing && (
                <div style={{ color: '#1890ff', fontSize: '13px', marginTop: '4px', fontWeight: 500 }}>
                    {expanded ? 'Thu gọn' : 'Xem thêm'}
                </div>
            )}
        </div>
    );
};

function NotificationManagement() {
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
            render: (text, record, index) => (currentPage - 1) * 10 + index + 1
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (text) => <ExpandableContent text={text} />
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            render: (text) => <ExpandableContent text={text} />
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
            render: (date) => {
                return new Date(date).toLocaleString("vi-VN", {
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
            title: <span style={{ whiteSpace: "nowrap" }}>Hành động</span>,
            dataIndex: "action",
            key: "action",
            width: 120,
            align: "center",
            render: (_, record) => {
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

    const handleSaveData = async (notice) => {
        try {
            await notificationApi.createNotification(notice);
            loadNotifications();
        } catch (err) {
            console.error("Lỗi tạo thông báo:", err);
        }
    }

    const handleDelete = async (id) => {
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
                    scroll={{ y: "calc(100vh - 310px)" }}
                    pagination={{
                        current: currentPage,
                        pageSize: 10,
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