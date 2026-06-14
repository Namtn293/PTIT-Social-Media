import "./PostLayout.css";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Popover, Badge, Spin, Tooltip, message, Dropdown, Modal, Input, Button } from "antd";
import {
    LikeOutlined, LikeFilled,
    CommentOutlined,
    SaveOutlined, SaveFilled,
    FlagOutlined, FlagFilled,
    UserOutlined, MailOutlined,
    IdcardOutlined, ReadOutlined,
    SendOutlined,
    MoreOutlined, EditOutlined, DeleteOutlined,
    CloseOutlined
} from "@ant-design/icons";
import useInfoApi from "../../api/UserInfoApi";
import postApi from "../../api/PostApi";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
dayjs.extend(relativeTime);
dayjs.locale("vi");

const PostLayout = ({ id, report, content, avatar, title, name, time, userName, classes, likes, comments, saves, initialLiked, initialSaved, initialReported, onRefresh }) => {
    const [likeCount, setLikeCount] = useState(likes || 0);
    const [liked, setLiked] = useState(initialLiked || false);
    const [saveCount, setSaveCount] = useState(saves || 0);
    const [saved, setSaved] = useState(initialSaved || false);
    const [reportCount, setReportCount] = useState(report || 0);
    const [reported, setReported] = useState(initialReported || false);
    const [userData, setUserData] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState(title || "");
    const [editContent, setEditContent] = useState(content || "");
    const [updating, setUpdating] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);

    const handleDeletePost = () => {
        Modal.confirm({
            title: "Xác nhận xóa bài viết",
            content: "Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            zIndex: 4000,
            onOk: async () => {
                try {
                    await postApi.deletePost(id);
                    message.success("Xóa bài viết thành công!");
                    if (onRefresh) onRefresh();
                } catch (err) {
                    console.error("Lỗi xóa bài viết:", err);
                    message.error("Xóa bài viết thất bại. Vui lòng thử lại!");
                }
            }
        });
    };

    const handleUpdatePost = async () => {
        if (!editTitle.trim()) {
            message.warning("Vui lòng nhập tiêu đề bài viết!");
            return;
        }
        if (!editContent.trim()) {
            message.warning("Vui lòng nhập nội dung bài viết!");
            return;
        }
        try {
            setUpdating(true);
            await postApi.updatePost({
                postId: id,
                title: editTitle.trim(),
                content: editContent.trim()
            });
            message.success("Cập nhật bài viết thành công!");
            setEditModalOpen(false);
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error("Lỗi cập nhật bài viết:", err);
            message.error("Cập nhật bài viết thất bại. Vui lòng thử lại!");
        } finally {
            setUpdating(false);
        }
    };

    // Sync state when props change (e.g. from refetching)
    useEffect(() => {
        setLiked(initialLiked || false);
    }, [initialLiked]);

    useEffect(() => {
        setSaved(initialSaved || false);
    }, [initialSaved]);

    useEffect(() => {
        setReported(initialReported || false);
    }, [initialReported]);

    useEffect(() => {
        setLikeCount(likes || 0);
    }, [likes]);

    useEffect(() => {
        setSaveCount(saves || 0);
    }, [saves]);

    useEffect(() => {
        setReportCount(report || 0);
    }, [report]);

    // Comment section
    const [showComments, setShowComments] = useState(false);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [commentCount, setCommentCount] = useState(comments || 0);
    const [commentInput, setCommentInput] = useState("");
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const commentInputRef = useRef(null);

    useEffect(() => {
        setCommentCount(comments || 0);
    }, [comments]);

    // Fetch comments khi mở panel
    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const res = await postApi.getComments(id);
            setCommentList(res?.data?.data || []);
        } catch (err) {
            console.error("Lỗi lấy bình luận:", err);
        } finally {
            setCommentsLoading(false);
        }
    };

    const openCommentModal = () => {
        setCommentModalOpen(true);
        if (commentList.length === 0) fetchComments();
        setTimeout(() => commentInputRef.current?.focus(), 200);
    };

    const closeCommentModal = () => {
        setCommentModalOpen(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) closeCommentModal();
    };

    const handleSubmitComment = async () => {
        if (!commentInput.trim()) return;
        setSubmitLoading(true);
        try {
            const res = await postApi.createComment({
                postId: id,
                content: commentInput.trim(),
                userId: localStorage.getItem("userId"),
            });
            const newComment = res?.data?.data;
            if (newComment) {
                setCommentList(prev => [...prev, newComment]);
            }
            setCommentCount(prev => prev + 1);
            setCommentInput("");
            message.success("Đã đăng bình luận!");
        } catch (err) {
            message.error("Đăng bình luận thất bại!");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCommentKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmitComment();
        }
    };

    const handleDeleteComment = (commentId) => {
        Modal.confirm({
            title: "Xác nhận xóa bình luận",
            content: "Bạn có chắc chắn muốn xóa bình luận này không? Thao tác này không thể hoàn tác.",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            zIndex: 4000,
            onOk: async () => {
                try {
                    const currentUserId = localStorage.getItem("userId");
                    await postApi.deleteComment(commentId, currentUserId);
                    message.success("Xóa bình luận thành công!");
                    setCommentList(prev => prev.filter(cmt => cmt.id !== commentId));
                    setCommentCount(prev => Math.max(0, prev - 1));
                    if (onRefresh) onRefresh();
                } catch (err) {
                    console.error("Lỗi xóa bình luận:", err);
                    message.error("Xóa bình luận thất bại. Vui lòng thử lại!");
                }
            }
        });
    };

    // Interact handlers
    const handleInteract = async (type) => {
        if (type === "like") {
            const next = !liked;
            setLiked(next);
            setLikeCount(prev => next ? prev + 1 : prev - 1);
            try {
                await postApi.likePost(id);
            } catch {
                setLiked(!next);
                setLikeCount(prev => next ? prev - 1 : prev + 1);
                message.error("Thao tác thất bại, vui lòng thử lại!");
            }
        } else if (type === "save") {
            const next = !saved;
            setSaved(next);
            setSaveCount(prev => next ? prev + 1 : prev - 1);
            try {
                await postApi.savePost(id);
                message.success(next ? "Đã lưu bài viết!" : "Đã bỏ lưu!");
            } catch {
                setSaved(!next);
                setSaveCount(prev => next ? prev - 1 : prev + 1);
                message.error("Thao tác thất bại, vui lòng thử lại!");
            }
        } else if (type === "report") {
            const next = !reported;
            setReported(next);
            setReportCount(prev => next ? prev + 1 : prev - 1);
            try {
                await postApi.reportPost(id);
                if (next) message.warning("Đã báo cáo bài viết này!");
            } catch {
                setReported(!next);
                setReportCount(prev => next ? prev - 1 : prev + 1);
                message.error("Thao tác thất bại, vui lòng thử lại!");
            }
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await useInfoApi.getUserInfo(userName);
                setUserData(response.data.data);
            } catch (err) {
                console.log("Lỗi lấy dữ liệu " + err);
            }
        };
        if (userName) fetchUserInfo();
    }, [userName]);

    const getFriendlyTime = (dateStr) => {
        if (!dateStr) return "";
        const postDate = dayjs(dateStr);
        const now = dayjs();
        return now.diff(postDate, 'day') < 7 ? postDate.fromNow() : postDate.format("DD/MM/YYYY");
    };

    const detailProfile = (
        <div style={{ width: "280px", padding: "8px" }}>
            <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "10px", marginBottom: "15px" }}>
                <div style={{ fontWeight: 700, fontSize: "18px", color: "#b71c1c" }}>Thông tin sinh viên</div>
            </div>
            {userData ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <UserOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Họ và tên:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>{name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <MailOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Email:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>{userData?.email || "Chưa cập nhật"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <IdcardOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Lớp:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>{classes || "N/A"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <ReadOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Ngành:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>{userData?.major || "Chưa cập nhật"}</span>
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                    <Spin description="Đang tải dữ liệu..." />
                </div>
            )}
        </div>
    );

    console.log("userName:", userName, "localStorage userName:", localStorage.getItem("userName"));
    const isOwner = userName && localStorage.getItem("userName") && 
                    userName.trim().toLowerCase() === localStorage.getItem("userName").trim().toLowerCase();

    const optionsContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px' }}>
            <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => {
                    setEditTitle(title);
                    setEditContent(content);
                    setEditModalOpen(true);
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '120px' }}
            >
                Sửa bài
            </Button>
            <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => {
                    handleDeletePost();
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '120px' }}
            >
                Xóa bài
            </Button>
        </div>
    );

    return (
        <div className="post-card">
            <div className="post-header">
                <Popover
                    styles={{ body: { borderRadius: '12px', padding: '10px' } }}
                    content={detailProfile}
                    trigger="click"
                    placement="right"
                    arrow={true}
                >
                    <Badge>
                        <img
                            className="avatar"
                            src={avatar || "https://tse3.mm.bing.net/th/id/OIP.aCwqDO1MIaS3qzA7DyFPdAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"}
                            alt="avatar"
                            style={{ cursor: "pointer" }}
                        />
                    </Badge>
                </Popover>
                <div className="user-info">
                    <div className="name-time">
                        <span className="name-post">{name}</span>
                        {classes && <span className="classes-post"> • {classes}</span>}
                        {time && (
                            <Tooltip title={dayjs(time).format("HH:mm:ss DD/MM/YYYY")}>
                                <span className="time-post"> • {getFriendlyTime(time)}</span>
                            </Tooltip>
                        )}
                    </div>
                    <span className="post-title">{title}</span>
                </div>
                {isOwner && (
                    <Popover
                        content={optionsContent}
                        trigger="click"
                        placement="bottomRight"
                        arrow={false}
                        styles={{ body: { padding: '4px', borderRadius: '8px' } }}
                    >
                        <div className="post-more-btn">
                            <MoreOutlined />
                        </div>
                    </Popover>
                )}
            </div>

            {/* Content */}
            <div className="post-content">{content}</div>

            {/* Actions */}
            <div className="post-actions">
                <Tooltip title={liked ? "Bỏ thích" : "Thích bài viết"}>
                    <div className={`action action-like ${liked ? "active-like" : ""}`} onClick={() => handleInteract("like")}>
                        {liked ? <LikeFilled /> : <LikeOutlined />}
                        <span>{likeCount}</span>
                    </div>
                </Tooltip>

                <Tooltip title="Xem bình luận">
                    <div
                        className={`action action-comment ${commentModalOpen ? "active-comment" : ""}`}
                        onClick={openCommentModal}
                    >
                        <CommentOutlined />
                        <span>{commentCount}</span>
                    </div>
                </Tooltip>

                <Tooltip title={saved ? "Bỏ lưu" : "Lưu bài viết"}>
                    <div className={`action action-save ${saved ? "active-save" : ""}`} onClick={() => handleInteract("save")}>
                        {saved ? <SaveFilled /> : <SaveOutlined />}
                        <span>{saveCount}</span>
                    </div>
                </Tooltip>

                <Tooltip title={reported ? "Bỏ báo cáo" : "Báo cáo bài viết"}>
                    <div className={`action action-report ${reported ? "active-report" : ""}`} onClick={() => handleInteract("report")}>
                        {reported ? <FlagFilled /> : <FlagOutlined />}
                        <span>{reportCount}</span>
                    </div>
                </Tooltip>
            </div>

            {/* ===== MODAL BÌNH LUẬN (Portal) ===== */}
            {commentModalOpen && createPortal(
                <div className="cmt-modal-overlay" onClick={handleOverlayClick}>
                    <div className="cmt-modal">
                        {/* Modal header */}
                        <div className="cmt-modal-header">
                            <div className="cmt-modal-header-left">
                                <CommentOutlined className="cmt-modal-icon" />
                                <div>
                                    <div className="cmt-modal-title">Bình luận</div>
                                    <div className="cmt-modal-subtitle">{title || "Bài viết"} · {name}</div>
                                </div>
                            </div>
                            <button className="cmt-modal-close" onClick={closeCommentModal} title="Đóng">
                                <CloseOutlined />
                            </button>
                        </div>

                        {/* Nội dung bài viết tóm tắt */}
                        <div className="cmt-modal-post-preview">
                            <img
                                src={avatar || "https://tse3.mm.bing.net/th/id/OIP.aCwqDO1MIaS3qzA7DyFPdAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"}
                                alt="avatar"
                                className="cmt-preview-avatar"
                            />
                            <div className="cmt-preview-body">
                                <span className="cmt-preview-name">{name}</span>
                                <p className="cmt-preview-content">{content?.length > 160 ? content.slice(0, 160) + "..." : content}</p>
                            </div>
                        </div>

                        {/* Danh sách bình luận */}
                        <div className="cmt-list">
                            {commentsLoading ? (
                                <div className="comment-loading">
                                    <Spin size="small" />
                                    <span>Đang tải bình luận...</span>
                                </div>
                            ) : commentList.length === 0 ? (
                                <div className="comment-empty">
                                    <CommentOutlined className="comment-empty-icon" />
                                    <span>Chưa có bình luận nào. Hãy là người đầu tiên!</span>
                                </div>
                            ) : (
                                commentList.map((cmt, idx) => {
                                    const isMe = String(cmt.userId) === String(localStorage.getItem("userId"));
                                    const authorName = isMe ? "Bạn" : (cmt.fullName || cmt.name || "Thành viên PTIT");
                                    const isAdmin = localStorage.getItem("role") === "ROLE_ADMIN";
                                    const canDeleteComment = isMe || isOwner || isAdmin;
                                    return (
                                        <div key={cmt.id || idx} className="comment-item">
                                            <img
                                                src={cmt.avatar || "https://tse3.mm.bing.net/th/id/OIP.aCwqDO1MIaS3qzA7DyFPdAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"}
                                                alt="avatar"
                                                className="comment-avatar"
                                            />
                                            <div className="comment-bubble-wrap">
                                                <div className="comment-bubble">
                                                    <span className="comment-author">{authorName}</span>
                                                    <p className="comment-text">{cmt.content}</p>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                                    {cmt.timestamp && (
                                                        <span className="comment-time">{getFriendlyTime(cmt.timestamp)}</span>
                                                    )}
                                                    {canDeleteComment && (
                                                        <span 
                                                            className="comment-delete-btn"
                                                            style={{ 
                                                                fontSize: '11px', 
                                                                color: '#ef4444', 
                                                                cursor: 'pointer',
                                                                userSelect: 'none',
                                                                fontWeight: '550'
                                                            }}
                                                            onClick={() => handleDeleteComment(cmt.id)}
                                                        >
                                                            • Xóa
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Ô nhập bình luận */}
                        <div className="cmt-modal-footer">
                            <img
                                src={localStorage.getItem("userAvatar") || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                                alt="me"
                                className="comment-avatar"
                            />
                            <div className="comment-input-wrap">
                                <textarea
                                    ref={commentInputRef}
                                    className="comment-textarea"
                                    placeholder="Viết bình luận của bạn... (Enter để gửi)"
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    onKeyDown={handleCommentKeyDown}
                                    rows={1}
                                    disabled={submitLoading}
                                />
                                <button
                                    className="comment-send-btn"
                                    onClick={handleSubmitComment}
                                    disabled={submitLoading || !commentInput.trim()}
                                    title="Gửi bình luận (Enter)"
                                >
                                    {submitLoading ? <span className="comment-spinner" /> : <SendOutlined />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal Sửa Bài Viết */}
            <Modal
                title={<span className="post-edit-modal-title">Chỉnh sửa bài viết</span>}
                open={editModalOpen}
                onCancel={() => !updating && setEditModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setEditModalOpen(false)} disabled={updating}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleUpdatePost} loading={updating} style={{ backgroundColor: "#b71c1c", borderColor: "#b71c1c" }}>
                        Lưu thay đổi
                    </Button>
                ]}
                centered
            >
                <div className="post-edit-modal-body">
                    <div className="post-edit-field">
                        <span className="post-edit-label">
                            Tiêu đề bài viết <span className="post-edit-required">*</span>
                        </span>
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Nhập tiêu đề..."
                            disabled={updating}
                            maxLength={200}
                            showCount
                        />
                    </div>
                    <div className="post-edit-field">
                        <span className="post-edit-label">
                            Nội dung <span className="post-edit-required">*</span>
                        </span>
                        <Input.TextArea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Nhập nội dung..."
                            disabled={updating}
                            autoSize={{ minRows: 5, maxRows: 12 }}
                            maxLength={5000}
                            showCount
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PostLayout;
