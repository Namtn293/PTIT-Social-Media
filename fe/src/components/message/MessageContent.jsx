import { useState, useRef, useEffect } from "react";
import { Popover, Spin, Modal, Input } from "antd";
import {
    UserOutlined, MailOutlined, ReadOutlined,
} from "@ant-design/icons";
import useInfoApi from "../../api/UserInfoApi";
import "./MessageContent.css";

const parseTimestamp = (timestampStr) => {
    if (!timestampStr) return new Date(0);
    const parts = timestampStr.split(" ");
    if (parts.length !== 2) return new Date(0);
    const timeParts = parts[0].split(":");
    const dateParts = parts[1].split("-");
    if (timeParts.length !== 3 || dateParts.length !== 3) return new Date(0);
    return new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[0]),
        parseInt(timeParts[0]),
        parseInt(timeParts[1]),
        parseInt(timeParts[2])
    );
};

const isOlderThanOneHour = (timestampStr) => {
    const messageDate = parseTimestamp(timestampStr);
    const now = new Date();
    return (now.getTime() - messageDate.getTime()) > 60 * 60 * 1000;
};

const MessageContent = ({id, userId, check, avatar, name, timestamp, message, userName, isEdited, onEdit, onDelete}) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [actionsVisible, setActionsVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editContent, setEditContent] = useState(message);
    const longPressTimeout = useRef(null);
    const isLongPress = useRef(false);

    const currentUserRole = localStorage.getItem("role");
    const isAdmin = currentUserRole === "ROLE_ADMIN";
    const isOwner = check;
    const olderThanOneHour = isOlderThanOneHour(timestamp);

    const isDeletedByUser = message === "[DELETED_BY_USER]";
    const isDeletedByAdmin = message === "[DELETED_BY_ADMIN]";
    const isDeleted = isDeletedByUser || isDeletedByAdmin;

    const canEdit = isOwner && !olderThanOneHour && !isDeleted && !isEdited;
    const canDelete = (isAdmin || (isOwner && !olderThanOneHour)) && !isDeleted;
    const hasPermissions = canEdit || canDelete;

    useEffect(() => {
        if (!actionsVisible) return;
        
        const handleOutsideClick = () => {
            setActionsVisible(false);
        };
        
        const timer = setTimeout(() => {
            document.addEventListener("click", handleOutsideClick);
            document.addEventListener("touchend", handleOutsideClick);
        }, 150);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("touchend", handleOutsideClick);
        };
    }, [actionsVisible]);

    const handleOpenChange = async (open) => {
        if (open && !userData && userName) {
            setIsLoading(true);
            try {
                const response = await useInfoApi.getUserInfo(userName);
                setUserData(response.data.data);
            } catch (err) {
                console.log("Lỗi lấy dữ liệu: " + err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleTouchStart = () => {
        isLongPress.current = false;
        longPressTimeout.current = setTimeout(() => {
            isLongPress.current = true;
            setActionsVisible(true);
        }, 600);
    };

    const handleTouchMove = () => {
        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
        }
    };

    const handleTouchEnd = (e) => {
        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
        }
        if (isLongPress.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const handleMouseDown = () => {
        isLongPress.current = false;
        longPressTimeout.current = setTimeout(() => {
            isLongPress.current = true;
            setActionsVisible(true);
        }, 600);
    };

    const handleMouseMove = () => {
        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
        }
    };

    const handleMouseUp = (e) => {
        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
        }
        if (isLongPress.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const handleClick = (e) => {
        if (isLongPress.current) {
            e.preventDefault();
            e.stopPropagation();
            isLongPress.current = false;
        }
    };

    const handleOpenEditModal = () => {
        setActionsVisible(false);
        setEditContent(message);
        setEditModalVisible(true);
    };

    const handleSaveEdit = () => {
        if (editContent.trim() && editContent !== message) {
            onEdit(id, editContent);
        }
        setEditModalVisible(false);
    };

    const handleDeleteConfirm = () => {
        setActionsVisible(false);
        Modal.confirm({
            title: "Xóa tin nhắn",
            content: "Bạn có chắc chắn muốn xóa tin nhắn này không?",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            zIndex: 4000,
            onOk() {
                onDelete(id);
            }
        });
    };

    const actionMenu = (
        <div 
            className="msg-action-menu" 
            onClick={(e) => e.stopPropagation()} 
            onTouchEnd={(e) => e.stopPropagation()}
        >
            {canEdit && (
                <button className="action-menu-btn edit-btn" onClick={handleOpenEditModal}>
                    Sửa
                </button>
            )}
            {canDelete && (
                <button className="action-menu-btn delete-btn" onClick={handleDeleteConfirm}>
                    Xóa
                </button>
            )}
        </div>
    );

    const renderBubble = () => {
        const bubbleContent = (
            <div 
                className="msg-bubble"
                onMouseDown={hasPermissions ? handleMouseDown : undefined}
                onMouseUp={hasPermissions ? handleMouseUp : undefined}
                onMouseMove={hasPermissions ? handleMouseMove : undefined}
                onTouchStart={hasPermissions ? handleTouchStart : undefined}
                onTouchMove={hasPermissions ? handleTouchMove : undefined}
                onTouchEnd={hasPermissions ? handleTouchEnd : undefined}
                onClick={hasPermissions ? handleClick : undefined}
                onContextMenu={hasPermissions ? (e) => {
                    e.preventDefault();
                    setActionsVisible(true);
                } : undefined}
                style={{ cursor: hasPermissions ? "pointer" : "default" }}
            >
                <div className="msg-text" style={isDeleted ? { color: "#94a3b8", fontStyle: "italic" } : undefined}>
                    {isDeletedByUser ? "Tin nhắn đã bị xóa" : isDeletedByAdmin ? "Tin nhắn bị xóa bởi admin" : message}
                </div>
                <div className="msg-time">{timestamp}{isEdited && " • Đã chỉnh sửa"}</div>
            </div>
        );

        if (hasPermissions) {
            return (
                <Popover
                    open={actionsVisible}
                    onOpenChange={(visible) => setActionsVisible(visible)}
                    content={actionMenu}
                    trigger={[]}
                    placement="top"
                    arrow={true}
                    overlayInnerStyle={{ borderRadius: '8px', padding: '4px' }}
                >
                    {bubbleContent}
                </Popover>
            );
        }

        return bubbleContent;
    };

    const detailProfile = (
        <div className="msg-profile-popover">
            <div className="popover-header">
                <span className="popover-title">Thông tin sinh viên</span>
            </div>

            {isLoading ? (
                <div className="popover-loading">
                    <Spin description="Đang tải dữ liệu..." />
                </div>
            ) : userData ? (
                <div className="popover-body">
                    {(userData.fullName || name) && (
                        <div className="popover-info-item">
                            <UserOutlined className="info-icon" />
                            <span className="info-label">Họ và tên:</span>
                            <span className="info-value">{userData.fullName || name}</span>
                        </div>
                    )}
                    {userData.email && (
                        <div className="popover-info-item">
                            <MailOutlined className="info-icon" />
                            <span className="info-label">Email:</span>
                            <span className="info-value">{userData.email}</span>
                        </div>
                    )}
                    {userData.major && (
                        <div className="popover-info-item">
                            <ReadOutlined className="info-icon" />
                            <span className="info-label">Ngành:</span>
                            <span className="info-value">{userData.major}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="popover-error">Không thể tải dữ liệu</div>
            )}
        </div>
    );

    return (
        <>
            {!check ? (
                <div className="msg-row msg-received">
                    <Popover 
                        overlayInnerStyle={{ borderRadius: '12px', padding: '10px' }} 
                        content={detailProfile} 
                        trigger="click" 
                        placement="rightTop" 
                        arrow={true} 
                        onOpenChange={handleOpenChange}
                    >
                        <img src={avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"} alt="avatar" className="msg-avatar" />
                    </Popover>
                    
                    <div className="msg-bubble-container">
                        <Popover 
                            overlayInnerStyle={{ borderRadius: '12px', padding: '10px' }} 
                            content={detailProfile} 
                            trigger="click" 
                            placement="top" 
                            arrow={true} 
                            onOpenChange={handleOpenChange}
                        >
                            <div className="msg-sender-name" style={{ cursor: "pointer" }}>{name}</div>
                        </Popover>
                        {renderBubble()}
                    </div>
                </div>
            ) : (
                <div className="msg-row msg-sent">
                    <div className="msg-bubble-container">
                        <Popover 
                            overlayInnerStyle={{ borderRadius: '12px', padding: '10px' }} 
                            content={detailProfile} 
                            trigger="click" 
                            placement="top" 
                            arrow={true} 
                            onOpenChange={handleOpenChange}
                        >
                            <div className="msg-sender-name" style={{ cursor: "pointer" }}>{name}</div>
                        </Popover>
                        {renderBubble()}
                    </div>
                    
                    <Popover 
                        overlayInnerStyle={{ borderRadius: '12px', padding: '10px' }} 
                        content={detailProfile} 
                        trigger="click" 
                        placement="leftTop" 
                        arrow={true} 
                        onOpenChange={handleOpenChange}
                    >
                        <img src={avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"} alt="avatar" className="msg-avatar" />
                    </Popover>
                </div>  
            )}

            <Modal
                title="Chỉnh sửa tin nhắn"
                open={editModalVisible}
                onOk={handleSaveEdit}
                onCancel={() => setEditModalVisible(false)}
                okText="Lưu"
                cancelText="Hủy"
                destroyOnClose
            >
                <Input.TextArea
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Nhập nội dung tin nhắn mới..."
                    maxLength={1000}
                    showCount
                />
            </Modal>
        </>
    );
};

export default MessageContent;