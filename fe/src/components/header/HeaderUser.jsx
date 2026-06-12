import "./HeaderUser.css"
import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import {
    BellOutlined,
    FormOutlined,
    HomeOutlined,
    WechatWorkOutlined,
    BookOutlined,
    UserOutlined,
    CameraOutlined,
    CloseOutlined,
    CheckOutlined,
    LockOutlined,
    MailOutlined,
    IdcardOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge, Popover, List, Avatar, message, Spin } from "antd";
import userInfoApi from "../../api/UserInfoApi";

function HeaderUser() {
    const navigate = useNavigate();
    const location = useLocation();

    // --- Profile modal state ---
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [headerAvatar, setHeaderAvatar] = useState("https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg");
    const fileInputRef = useRef(null);

    const userName = localStorage.getItem("userName") || localStorage.getItem("userId");

    const fetchCurrentAvatar = async () => {
        if (!userName) return;
        try {
            const res = await userInfoApi.getUserInfo(userName);
            const data = res?.data?.data;
            if (data?.avatar) {
                setHeaderAvatar(data.avatar);
                localStorage.setItem("userAvatar", data.avatar);
            } else {
                localStorage.removeItem("userAvatar");
            }
        } catch (err) {
            console.error("Failed to load header avatar:", err);
        }
    };

    useEffect(() => {
        fetchCurrentAvatar();
    }, [userName]);

    const openProfile = async () => {
        setProfileOpen(true);
        setProfileLoading(true);
        try {
            const res = await userInfoApi.getUserInfo(userName);
            const data = res?.data?.data;
            setProfileData(data);
            setForm({
                fullName: data?.fullName || "",
                email: data?.email || "",
                password: "",
            });
            setAvatarPreview(data?.avatar || null);
        } catch (err) {
            message.error("Không thể tải thông tin cá nhân!");
        } finally {
            setProfileLoading(false);
        }
    };

    const closeProfile = () => {
        if (submitLoading) return;
        setProfileOpen(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        setProfileData(null);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) closeProfile();
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            message.warning("Vui lòng chọn file ảnh!");
            return;
        }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!form.fullName.trim() && !form.email.trim() && !form.password.trim() && !avatarFile) {
            message.warning("Vui lòng thay đổi ít nhất một thông tin hoặc chọn ảnh đại diện!");
            return;
        }
        setSubmitLoading(true);
        try {
            const payload = {};
            if (form.fullName.trim()) payload.fullName = form.fullName.trim();
            if (form.email.trim()) payload.email = form.email.trim();
            if (form.password.trim()) payload.password = form.password.trim();
            await userInfoApi.updateUserInfo(userName, payload, avatarFile);
            message.success("Cập nhật thông tin thành công!");
            closeProfile();
            fetchCurrentAvatar();
        } catch (err) {
            console.error(err);
            message.error("Cập nhật thất bại. Vui lòng thử lại!");
        } finally {
            setSubmitLoading(false);
        }
    };

    // --- Notification ---
    const data = [
        { title: "Thông báo mới", description: "Bạn có bài viết mới cần xem" },
        { title: "Cộng đồng", description: "Có người vừa bình luận bài viết của bạn" },
    ];

    const onFinish = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const notificationContent = (
        <div style={{ padding: "0px" }}>
            <h3 style={{ marginBottom: "8px", marginTop: "0px" }}>Thông báo mới</h3>
            <div style={{ maxHeight: "300px", overflowY: "auto", width: "300px" }} className="notification-container">
                {data.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item className="notification-item" style={{ cursor: "pointer", padding: "10px" }}>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<BellOutlined />} style={{ backgroundColor: "#fd4e57" }} />}
                                    title={item.title}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <div style={{ textAlign: "center" }}>Không có thông báo</div>
                )}
            </div>
        </div>
    );

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header-wrap">
            <div className="menu-wrap">
                <div className="header-logo" onClick={() => navigate("/")}>
                    <img
                        src="https://career.gpo.vn/uploads/images/truong-hoc/logo-hoc-vien-cong-nghe-buu-chinh-vien-thong-1-.jpg"
                        alt="logo"
                        className="logo-img"
                    />
                    <div className="logo-title">
                        <span className="logo-title-main">PTIT STUDY</span>
                        <span className="logo-title-separator">|</span>
                        <span className="logo-title-sub">Nền tảng học tập</span>
                    </div>
                </div>

                <nav className="nav-menu">
                    <div className={`nav-item ${isActive("/") ? "active" : ""}`} onClick={() => navigate("/")}>
                        <HomeOutlined /><span>Trang chủ</span>
                    </div>
                    <div className={`nav-item ${isActive("/bai-viet") ? "active" : ""}`} onClick={() => navigate("/bai-viet")}>
                        <FormOutlined /><span>Bài viết</span>
                    </div>
                    <div className={`nav-item ${isActive("/cong-dong") ? "active" : ""}`} onClick={() => navigate("/cong-dong")}>
                        <WechatWorkOutlined /><span>Cộng đồng</span>
                    </div>
                    <div className={`nav-item ${isActive("/tai-lieu") ? "active" : ""}`} onClick={() => navigate("/tai-lieu")}>
                        <BookOutlined /><span>Tài liệu</span>
                    </div>
                </nav>
            </div>

            <div className="right-wrap">
                <Popover content={notificationContent} trigger="click" placement="bottom" arrow={true}>
                    <Badge count={data.length}>
                        <div className="bell"><BellOutlined /></div>
                    </Badge>
                </Popover>

                {/* Avatar — click để mở modal profile */}
                <img
                    className="avatar header-avatar-btn"
                    src={headerAvatar}
                    alt="avatar"
                    onClick={openProfile}
                    title="Cập nhật thông tin cá nhân"
                />

                <button className="logout-btn" onClick={onFinish}>Đăng xuất</button>
            </div>

            {/* ===== MODAL CẬP NHẬT THÔNG TIN (Portal) ===== */}
            {profileOpen && createPortal(
                <div className="profile-overlay" onClick={handleOverlayClick}>
                    <div className="profile-modal">
                        {/* Header */}
                        <div className="profile-modal-header">
                            <div className="profile-modal-header-left">
                                <div className="profile-modal-icon-wrap">
                                    <UserOutlined />
                                </div>
                                <div>
                                    <div className="profile-modal-title">Thông tin cá nhân</div>
                                    <div className="profile-modal-subtitle">Cập nhật hồ sơ của bạn</div>
                                </div>
                            </div>
                            <button className="profile-modal-close" onClick={closeProfile} disabled={submitLoading}>
                                <CloseOutlined />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="profile-modal-body">
                            {profileLoading ? (
                                <div className="profile-loading">
                                    <Spin size="large" />
                                    <span>Đang tải thông tin...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Avatar picker */}
                                    <div className="profile-avatar-section">
                                        <div className="profile-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                                            <img
                                                src={avatarPreview || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                                                alt="avatar"
                                                className="profile-avatar-img"
                                            />
                                            <div className="profile-avatar-overlay">
                                                <CameraOutlined className="profile-avatar-camera" />
                                                <span>Thay ảnh</span>
                                            </div>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleAvatarChange}
                                        />
                                        {avatarFile && (
                                            <span className="profile-avatar-filename">{avatarFile.name}</span>
                                        )}
                                    </div>

                                    {/* Fields */}
                                    <div className="profile-fields">
                                        {/* Tài khoản (readonly) */}
                                        <div className="profile-field">
                                            <label className="profile-label">
                                                <IdcardOutlined /> Tài khoản
                                            </label>
                                            <input
                                                className="profile-input profile-input-readonly"
                                                value={profileData?.userName || userName || ""}
                                                readOnly
                                            />
                                        </div>

                                        {/* Mật khẩu mới */}
                                        <div className="profile-field">
                                            <label className="profile-label">
                                                <LockOutlined /> Mật khẩu mới
                                            </label>
                                            <input
                                                className="profile-input"
                                                type="password"
                                                placeholder="Để trống nếu không đổi mật khẩu"
                                                value={form.password}
                                                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                                                disabled={submitLoading}
                                            />
                                        </div>

                                        {/* Họ và tên */}
                                        <div className="profile-field">
                                            <label className="profile-label">
                                                <UserOutlined /> Họ và tên
                                            </label>
                                            <input
                                                className="profile-input"
                                                type="text"
                                                placeholder="Nhập họ và tên đầy đủ..."
                                                value={form.fullName}
                                                onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
                                                disabled={submitLoading}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="profile-field">
                                            <label className="profile-label">
                                                <MailOutlined /> Email
                                            </label>
                                            <input
                                                className="profile-input"
                                                type="email"
                                                placeholder="example@ptit.edu.vn"
                                                value={form.email}
                                                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                                disabled={submitLoading}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {!profileLoading && (
                            <div className="profile-modal-footer">
                                <button
                                    className="profile-cancel-btn"
                                    onClick={closeProfile}
                                    disabled={submitLoading}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="profile-submit-btn"
                                    onClick={handleSubmit}
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? (
                                        <><span className="profile-spinner" /> Đang lưu...</>
                                    ) : (
                                        <><CheckOutlined /> Cập nhật</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </header>
    );
}

export default HeaderUser;