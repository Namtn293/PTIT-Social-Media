import { useState, useEffect } from "react";
import { Avatar, Badge, Button, List, Popover } from "antd";
import "./HeaderAdmin.css"
import { useLocation, useNavigate } from "react-router-dom";
import { BellOutlined } from "@ant-design/icons"
import notificationApi from "../../api/NotificationApi";

const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
};

function HeaderAdmin() {
    const location = useLocation();
    const navigate = useNavigate();

    const titleMap = {
        "/": "Bảng tin",
        "/nguoi-dung": "Người dùng",
        "/bai-viet": "Bài viết",
        "/cong-dong": "Cộng đồng",
        "/bao-cao-bai-viet": "Báo cáo",
        "/quan-ly-thong-bao": "Thông báo",
    }
    const title = titleMap[location.pathname];

    const onFinish = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    }

    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await notificationApi.getMyNotifications();
            if (res.data && res.data.data) {
                const formatted = res.data.data.map(item => ({
                    id: item.id,
                    title: item.createBy
                        ? `${item.createBy}: ${item.title ? item.title + " - " : ""}${item.content}`
                        : (item.content || "Thông báo hệ thống"),
                    description: formatTimeAgo(item.createAt)
                }));
                setNotifications(formatted);
            }
        } catch (err) {
            console.error("Lỗi lấy thông báo:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, []);

    const notificationContent = (
        <div style={{ padding: "0px" }}>
            <h3 style={{ marginBottom: "8px", marginTop: "0px" }}>Thông báo mới</h3>
            <div style={{ maxHeight: "300px", overflowY: 'auto', width: "300px" }} className="notification-container" >
                {notifications.length > 0 ? (
                    <div>
                        <List
                            itemLayout="horizontal"
                            dataSource={notifications}
                            renderItem={(item) => (
                                <List.Item className="notification-item" style={{ cursor: "pointer", padding: "10px" }}>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<BellOutlined />} style={{ backgroundColor: "#fd4e57" }} />}
                                        description={item.description}
                                        title={item.title}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>Không có thông báo</div>
                )}
            </div>
        </div>
    )

    return (
        <div className="container-admin-header">
            <div style={{ marginRight: "auto", width: "200px", fontWeight: "500", color: "#A50000", fontSize: "27px", display: "flex" }}>{title}</div>
            <Popover
                content={notificationContent}
                trigger="click"
                placement="bottom"
                arrow={true}
            >
                <Badge count={notifications.length}>
                    <BellOutlined className="bell-icon" />
                </Badge>
            </Popover>
            <Button type="primary" onClick={onFinish}>Đăng xuất</Button>
        </div>
    )
}

export default HeaderAdmin;