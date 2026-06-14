import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeaderUser from '../../components/header/HeaderUser';
import PostLayout from '../../components/post/PostLayout';
import postApi from '../../api/PostApi';
import { Spin, Input, Empty, message } from 'antd';
import { SearchOutlined, EditOutlined, FireOutlined, QuestionCircleOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import './PostPage.css';

const { TextArea } = Input;

function PostPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'all'; // 'all', 'mine', 'saved'

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [currentTab]);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            let response;
            if (currentTab === 'mine') {
                response = await postApi.getMyPosts();
            } else if (currentTab === 'saved') {
                response = await postApi.getSavePosts();
            } else {
                response = await postApi.getAllHomePosts();
            }

            if (response?.data?.data) {
                const sortedPosts = response.data.data.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.time || 0);
                    const dateB = new Date(b.createdAt || b.time || 0);
                    return dateB - dateA;
                });
                setPosts(sortedPosts);
            } else {
                setPosts([]);
            }
        } catch (err) {
            console.error("Lỗi lấy danh sách bài viết:", err);
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = () => {
        setPostTitle("");
        setPostContent("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (isSubmitting) return;
        setShowModal(false);
        setPostTitle("");
        setPostContent("");
    };

    const handleSubmitPost = async () => {
        if (!postTitle.trim()) {
            message.warning("Vui lòng nhập tiêu đề bài viết!");
            return;
        }
        if (!postContent.trim()) {
            message.warning("Vui lòng nhập nội dung bài viết!");
            return;
        }
        try {
            setIsSubmitting(true);
            await postApi.createPost({
                title: postTitle.trim(),
                content: postContent.trim(),
            });
            message.success("Đăng bài thành công!");
            closeModal();
            fetchPosts();
        } catch (err) {
            console.error("Lỗi đăng bài:", err);
            message.error("Đăng bài thất bại. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) closeModal();
    };

    const removeVietnameseTones = (str) => {
        return str
            ?.normalize("NFD")
            ?.replace(/[\u0300-\u036f]/g, "")
            ?.replace(/đ/g, "d")
            ?.replace(/Đ/g, "D")
            ?.toLowerCase()
            ?.trim() || "";
    };

    const filteredPosts = posts.filter(post => {
        const keyword = removeVietnameseTones(searchText);
        const titleMatch = removeVietnameseTones(post.title || "").includes(keyword);
        const contentMatch = removeVietnameseTones(post.content || "").includes(keyword);
        const authorMatch = removeVietnameseTones(post.name || "").includes(keyword);
        return titleMatch || contentMatch || authorMatch;
    });

    return (
        <div className="post-page-wrapper">
            <HeaderUser />

            <div className="post-page-container">
                <div className="post-main-content">
                    {/* CỘT CHÍNH: BÀI VIẾT */}
                    <div className="post-feed-column">

                        {/* Thanh tìm kiếm bài viết */}
                        <div className="post-search-section">
                            <Input
                                placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung hoặc tác giả..."
                                size="large"
                                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                                className="search-post-input"
                            />
                        </div>

                        {/* Tabs chuyển đổi bộ lọc bài viết */}
                        <div className="post-tabs-container">
                            <button 
                                className={`post-tab-btn ${currentTab === 'all' ? 'active' : ''}`}
                                onClick={() => setSearchParams({ tab: 'all' })}
                            >
                                Bài viết chung
                            </button>
                            <button 
                                className={`post-tab-btn ${currentTab === 'mine' ? 'active' : ''}`}
                                onClick={() => setSearchParams({ tab: 'mine' })}
                            >
                                Bài viết của tôi
                            </button>
                            <button 
                                className={`post-tab-btn ${currentTab === 'saved' ? 'active' : ''}`}
                                onClick={() => setSearchParams({ tab: 'saved' })}
                            >
                                Bài viết đã lưu
                            </button>
                        </div>

                        {/* Hộp giả lập Tạo bài viết - Chỉ hiển thị ở Tab Bài viết của tôi */}
                        {currentTab === 'mine' && (
                            <div className="create-post-card">
                                <img
                                    className="create-post-avatar"
                                    src={localStorage.getItem("userAvatar") || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                                    alt="avatar"
                                />
                                <div className="create-post-input-placeholder" onClick={openModal}>
                                    Bạn đang muốn chia sẻ tài liệu hay thắc mắc gì thế?
                                </div>
                                <button className="create-post-btn" onClick={openModal}>
                                    <EditOutlined /> <span>Đăng bài</span>
                                </button>
                            </div>
                        )}

                        {/* Danh sách bài viết */}
                        {isLoading ? (
                            <div className="post-loading-container">
                                <Spin size="large" description="Đang tải các bài viết mới nhất..." />
                            </div>
                        ) : filteredPosts.length > 0 ? (
                            <div className="posts-list">
                                {filteredPosts.map((post) => (
                                    <PostLayout
                                        key={post.id}
                                        id={post.id}
                                        report={post.report || 0}
                                        content={post.content}
                                        avatar={post.avatar}
                                        title={post.title}
                                        name={post.name || "Thành viên PTIT"}
                                        time={post.time}
                                        userName={post.userName}
                                        classes={post.classes}
                                        likes={post.likes !== undefined ? post.likes : 0}
                                        comments={post.comments !== undefined ? post.comments : 0}
                                        saves={post.saves !== undefined ? post.saves : 0}
                                        initialLiked={post.liked}
                                        initialSaved={post.saved}
                                        initialReported={post.reported}
                                        onRefresh={fetchPosts}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="post-empty-container">
                                <Empty
                                    description="Không tìm thấy bài viết nào phù hợp"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            </div>
                        )}
                    </div>

                    {/* CỘT PHỤ BÊN PHẢI: WIDGETS */}
                    <aside className="post-sidebar-column">
                        <div className="sidebar-widget rule-widget">
                            <h3><QuestionCircleOutlined className="widget-icon" /> Quy định cộng đồng</h3>
                            <ul>
                                <li>Chia sẻ tài liệu chính xác, ghi rõ nguồn.</li>
                                <li>Không đăng tải nội dung quảng cáo, spam.</li>
                                <li>Tôn trọng các thành viên khác khi bình luận.</li>
                                <li>Bài viết vi phạm sẽ bị quản trị viên gỡ bỏ.</li>
                            </ul>
                        </div>

                        <div className="sidebar-widget topics-widget">
                            <h3><FireOutlined className="widget-icon hot" /> Chủ đề học tập nổi bật</h3>
                            <div className="tags-container">
                                <span className="topic-tag">#Kỹ-Nghệ-Phần-Mềm</span>
                                <span className="topic-tag">#Lập-Trình-Mạng</span>
                                <span className="topic-tag">#Cơ-Sở-Dữ-Liệu</span>
                                <span className="topic-tag">#Đại-Số-Tuyến-Tính</span>
                                <span className="topic-tag">#An-Toàn-Thông-Tin</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ===== MODAL TẠO BÀI VIẾT ===== */}
            {showModal && (
                <div className="create-post-overlay" onClick={handleOverlayClick}>
                    <div className="create-post-modal">
                        {/* Header */}
                        <div className="modal-header">
                            <div className="modal-header-left">
                                <div className="modal-icon-wrap">
                                    <EditOutlined />
                                </div>
                                <div>
                                    <h2 className="modal-title">Tạo bài viết mới</h2>
                                    <p className="modal-subtitle">Chia sẻ kiến thức cùng cộng đồng PTIT</p>
                                </div>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal} disabled={isSubmitting}>
                                <CloseOutlined />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            <div className="modal-field">
                                <label className="modal-label">
                                    Tiêu đề bài viết <span className="modal-required">*</span>
                                </label>
                                <Input
                                    value={postTitle}
                                    onChange={(e) => setPostTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                                    className="modal-input-title"
                                    maxLength={200}
                                    showCount
                                    disabled={isSubmitting}
                                    onPressEnter={() => document.querySelector('.modal-input-content textarea')?.focus()}
                                />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">
                                    Nội dung <span className="modal-required">*</span>
                                </label>
                                <TextArea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="Nhập nội dung bài viết... Chia sẻ tài liệu, thắc mắc hoặc kinh nghiệm học tập!"
                                    className="modal-input-content"
                                    autoSize={{ minRows: 5, maxRows: 12 }}
                                    maxLength={5000}
                                    showCount
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button
                                className="modal-cancel-btn"
                                onClick={closeModal}
                                disabled={isSubmitting}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className="modal-submit-btn"
                                onClick={handleSubmitPost}
                                disabled={isSubmitting || !postTitle.trim() || !postContent.trim()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="modal-btn-spinner" />
                                        Đang đăng...
                                    </>
                                ) : (
                                    <>
                                        <SendOutlined />
                                        Đăng bài
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostPage;
