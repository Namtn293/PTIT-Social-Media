import { useState, useEffect, useRef } from "react";
import "./HeaderUser.css";
import {
    BellOutlined,
    FormOutlined,
    HomeOutlined,
    WechatWorkOutlined,
    BookOutlined,
    CompassOutlined,
    FileTextOutlined
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";
import { Button, Badge, Popover, List, Avatar, Modal, Input, message } from "antd";
import userInfoApi from "../../api/UserInfoApi";

function HeaderUser() {
    const navigate = useNavigate();
    const location = useLocation();

    const [userInfo, setUserInfo] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    
    // Form fields state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const titleMap = {
        "/": "Trang chủ",
        "/bai-viet": "Bài viết",
        "/cong-dong": "Cộng đồng",
        "/tai-lieu": "Tài liệu",
    };

    const title = titleMap[location.pathname] || "Trang chủ";

    const data = [
        {
            title: "Thông báo mới",
            description: "Bạn có bài viết mới cần xem"
        },
        {
            title: "Cộng đồng",
            description: "Có người vừa bình luận bài viết của bạn"
        }
    ];

    const fetchUserData = async () => {
        const userName = localStorage.getItem("userName");
        if (!userName) return;
        try {
            const res = await userInfoApi.getUserInfo(userName);
            const data = res?.data?.data;
            if (data) {
                setUserInfo(data);
                setFullName(data.fullName || "");
                setEmail(data.email || "");
                if (data.avatar) {
                    localStorage.setItem("userAvatar", data.avatar);
                }
            }
        } catch (err) {
            console.error("Lỗi tải thông tin cá nhân:", err);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const openModal = () => {
        if (userInfo) {
            setFullName(userInfo.fullName || "");
            setEmail(userInfo.email || "");
            setPassword("");
            setFile(null);
            setPreviewUrl(userInfo.avatar || "");
        }
        setModalOpen(true);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpdate = async () => {
        const userName = localStorage.getItem("userName");
        if (!userName) return;
        if (!fullName.trim()) {
            message.warning("Vui lòng nhập họ và tên!");
            return;
        }
        if (!email.trim()) {
            message.warning("Vui lòng nhập email!");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                fullName: fullName.trim(),
                email: email.trim()
            };
            if (password) {
                payload.password = password;
            }
            await userInfoApi.updateUserInfo(userName, payload, file);
            message.success("Cập nhật thông tin thành công!");
            setModalOpen(false);
            await fetchUserData();
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            message.error("Cập nhật thông tin thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const onFinish = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("userAvatar");
        navigate("/login");
    };

    const notificationContent = (
        <div style={{ padding: "0px" }}>
            <h3 style={{ marginBottom: "8px", marginTop: "0px" }}>
                Thông báo mới
            </h3>

            <div
                style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    width: "300px"
                }}
                className="notification-container"
            >
                {data.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item
                                className="notification-item"
                                style={{
                                    cursor: "pointer",
                                    padding: "10px"
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            icon={<BellOutlined />}
                                            style={{
                                                backgroundColor: "#fd4e57"
                                            }}
                                        />
                                    }
                                    title={item.title}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <div style={{ textAlign: "center" }}>
                        Không có thông báo
                    </div>
                )}
            </div>
        </div>
    );

    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get("tab") || "all";
    const isPostPage = location.pathname.startsWith("/bai-viet");

    const postMenuContent = (
        <div className="post-dropdown-menu">
            <button 
                className={`post-dropdown-item ${isPostPage && activeTab === "all" ? "active" : ""}`}
                onClick={() => navigate("/bai-viet?tab=all")}
            >
                <CompassOutlined className="post-dropdown-icon" />
                <span>Bài viết chung</span>
            </button>
            <button 
                className={`post-dropdown-item ${isPostPage && activeTab === "mine" ? "active" : ""}`}
                onClick={() => navigate("/bai-viet?tab=mine")}
            >
                <FileTextOutlined className="post-dropdown-icon" />
                <span>Bài viết của tôi</span>
            </button>
            <button 
                className={`post-dropdown-item ${isPostPage && activeTab === "saved" ? "active" : ""}`}
                onClick={() => navigate("/bai-viet?tab=saved")}
            >
                <BookOutlined className="post-dropdown-icon" />
                <span>Bài viết đã lưu</span>
            </button>
        </div>
    );

    return (
        <div>
            <div
                className="header-wrap"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "20px",
                    backgroundColor: "white"
                }}
            >
                
                <div
                    className="menu-wrap"
                    style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent:"space-between"
                    }}
                >
                    <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <img
                        src="https://career.gpo.vn/uploads/images/truong-hoc/logo-hoc-vien-cong-nghe-buu-chinh-vien-thong-1-.jpg"
                        alt="logo"
                        style={{ height: "50px" }}
                        />
                        <div className="logo-title" style={{fontSize:"20px", marginLeft:"10px"}}>
                            PTIT STUDY
                        </div>
                    </div>
                    
                    <div
                        style={{
                        marginLeft:"400px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center"
                    }}
                    >
                        <div
                        className={`home ${location.pathname === "/" ? "active" : ""}`}
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                        >
                        <HomeOutlined /> Trang chủ
                        </div>

                        <Popover
                            content={postMenuContent}
                            trigger="click"
                            placement="bottom"
                            arrow={false}
                            styles={{ body: { padding: '4px', borderRadius: '8px' } }}
                        >
                            <div
                                className={`post ${location.pathname.startsWith("/bai-viet") ? "active" : ""}`}
                                style={{ cursor: "pointer" }}
                            >
                                <FormOutlined /> Bài viết
                            </div>
                        </Popover>

                        <div
                            className={`community ${location.pathname === "/cong-dong" ? "active" : ""}`}
                            onClick={() => navigate("/cong-dong")}
                            style={{ cursor: "pointer" }}
                        >
                            <WechatWorkOutlined /> Cộng đồng
                        </div>

                        <div
                            className={`document ${location.pathname === "/tai-lieu" ? "active" : ""}`}
                            onClick={() => navigate("/tai-lieu")}
                            style={{ cursor: "pointer" }}
                        >
                            <BookOutlined /> Tài liệu
                        </div>
                    </div>
                    
                </div>

                
                <div
                    className="right-wrap"
                    style={{
                        display: "flex",
                        gap: "30px",
                        alignItems: "center"
                    }}
                >
                    <Popover
                        content={notificationContent}
                        trigger="click"
                        placement="bottom"
                        arrow={true}
                    >
                        <Badge count={data.length}>
                            <div className="bell">
                                <BellOutlined />
                            </div>
                        </Badge>
                    </Popover>

                    <img
                        className="avatar"
                        src={userInfo?.avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                        alt="avatar"
                        style={{ height: "50px", borderRadius: "50%", cursor: "pointer" }}
                        onClick={openModal}
                    />

                    <Button
                        type="primary"
                        onClick={onFinish}
                        style={{
                            backgroundColor: "#ff4d4f",
                            width: "100px",
                            borderRadius: "5px"
                        }}
                    >
                        Đăng xuất
                    </Button>
                </div>
            </div>

            {/* Profile Update Modal */}
            <Modal
                title={<span style={{ fontWeight: 700, fontSize: "20px", color: "#b71c1c" }}>Cập nhật thông tin cá nhân</span>}
                open={modalOpen}
                onCancel={() => !loading && setModalOpen(false)}
                footer={null}
                width={450}
                centered
            >
                <div className="profile-modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "10px" }}>
                    
                    {/* Avatar Upload Container */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                        <div className="avatar-preview-wrapper" onClick={handleAvatarClick} style={{ position: "relative", cursor: "pointer" }}>
                            <img
                                src={previewUrl || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                                alt="avatar preview"
                                className="avatar-preview"
                                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid #f0f0f0" }}
                            />
                            <div className="avatar-overlay">
                                <span>Thay ảnh</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontWeight: 500, color: "#333" }}>Tài khoản</span>
                        <Input
                            value={userInfo?.userName || ""}
                            disabled
                            style={{ height: "40px", backgroundColor: "#f5f5f5", color: "#8c8c8c", cursor: "not-allowed" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontWeight: 500, color: "#333" }}>Họ và tên</span>
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={loading}
                            style={{ height: "40px" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontWeight: 500, color: "#333" }}>Email</span>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            style={{ height: "40px" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontWeight: 500, color: "#333" }}>Mật khẩu mới</span>
                        <Input.Password
                            placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            style={{ height: "40px" }}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "15px" }}>
                        <Button onClick={() => setModalOpen(false)} disabled={loading} style={{ height: "40px", borderRadius: "6px" }}>
                            Hủy
                        </Button>
                        <Button type="primary" onClick={handleUpdate} loading={loading} style={{ height: "40px", borderRadius: "6px", backgroundColor: "#b71c1c", borderColor: "#b71c1c" }}>
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default HeaderUser;