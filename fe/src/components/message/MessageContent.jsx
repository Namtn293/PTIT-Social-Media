import { useState } from "react";
import { Popover, Spin } from "antd";
import {
    UserOutlined, MailOutlined, IdcardOutlined, ReadOutlined,
} from "@ant-design/icons";
import useInfoApi from "../../api/UserInfoApi";
import "./MessageContent.css";

const MessageContent = ({check, avatar, name, timestamp, message, userName}) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
                        <div className="msg-bubble">
                            <div className="msg-text">{message}</div>
                            <div className="msg-time">{timestamp}</div>
                        </div>
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
                        <div className="msg-bubble">
                            <div className="msg-text">{message}</div>
                            <div className="msg-time">{timestamp}</div>
                        </div>
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
        </>
    );
};

export default MessageContent;