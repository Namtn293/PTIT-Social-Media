import React, { useState, useEffect, useRef } from 'react';
import HeaderUser from '../../components/header/HeaderUser';
import Footer from '../../components/footer/Footer';
import documentApi from '../../api/DocumentApi';
import { Spin, Input, Button, Modal, Empty, message, Card } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusOutlined, FilePdfOutlined, FileWordOutlined, FileUnknownOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import './DocumentPage.css';

function DocumentPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [activeTab, setActiveTab] = useState("repo"); // "repo" or "my-docs"

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [docTitle, setDocTitle] = useState("");
    const [docFile, setDocFile] = useState(null);
    const [docImage, setDocImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const currentUserName = localStorage.getItem("userName");
    const currentUserRole = localStorage.getItem("role");

    useEffect(() => {
        fetchInitialData();
    }, [activeTab]);

    useEffect(() => {
        setSearchText("");
    }, [activeTab]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const docsRes = activeTab === 'repo' 
                ? await documentApi.getAllDocuments() 
                : await documentApi.getMyDocuments();
            if (docsRes?.data?.data) {
                setDocuments(docsRes.data.data);
            }
        } catch (err) {
            console.error("Lỗi lấy dữ liệu:", err);
            message.error("Lỗi tải danh sách tài liệu!");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleDownload = (fileURL) => {
        if (!fileURL) {
            message.error("Đường dẫn tệp tin không tồn tại!");
            return;
        }
        window.open(fileURL, '_blank');
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await documentApi.deleteDocument(id);
                    message.success("Xóa tài liệu thành công!");
                    fetchInitialData();
                } catch (err) {
                    console.error("Lỗi xóa tài liệu:", err);
                    message.error("Xóa tài liệu thất bại!");
                }
            }
        });
    };

    const openUploadModal = () => {
        setDocTitle("");
        setDocFile(null);
        setDocImage(null);
        setImagePreview("");
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocFile(file);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!docTitle.trim()) {
            message.warning("Vui lòng nhập tiêu đề tài liệu!");
            return;
        }
        if (!docFile) {
            message.warning("Vui lòng tải lên file tài liệu!");
            return;
        }

        try {
            setIsSubmitting(true);
            const data = {
                title: docTitle.trim()
            };
            await documentApi.createDocument(data, docFile, docImage);
            message.success("Đăng tài liệu thành công!");
            setShowModal(false);
            fetchInitialData();
        } catch (err) {
            console.error("Lỗi đăng tài liệu:", err);
            message.error("Đăng tài liệu thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFileIcon = (fileURL) => {
        if (!fileURL) return <FileUnknownOutlined className="doc-icon" />;
        const extension = fileURL.split('.').pop().toLowerCase();
        if (extension === 'pdf') {
            return <FilePdfOutlined className="doc-icon pdf" />;
        } else if (['doc', 'docx'].includes(extension)) {
            return <FileWordOutlined className="doc-icon word" />;
        }
        return <FileUnknownOutlined className="doc-icon" />;
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

    const filteredDocuments = documents.filter(doc => {
        if (activeTab === 'my-docs' && doc.createBy !== currentUserName) {
            return false;
        }
        return removeVietnameseTones(doc.title).includes(removeVietnameseTones(searchText)) ||
            removeVietnameseTones(doc.uploaderName || "").includes(removeVietnameseTones(searchText));
    });

    return (
        <div className="document-page-wrapper">
            <HeaderUser />

            <div className="document-page-container">
                {/* Navigation Tabs */}
                <div className="doc-nav-tabs">
                    <Button
                        className={`btn-nav-tab ${activeTab === 'repo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('repo')}
                    >
                        Kho tài liệu
                    </Button>
                    <Button
                        className={`btn-nav-tab ${activeTab === 'my-docs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my-docs')}
                    >
                        Tài liệu của tôi
                    </Button>
                </div>

                {/* Header Section */}
                <div className="doc-header-section">
                    <div className="doc-header-left">
                        <h2>{activeTab === 'repo' ? "Kho tài liệu học tập" : "Tài liệu của tôi"}</h2>
                        <p>{activeTab === 'repo' ? "Tìm kiếm và chia sẻ các tài liệu ôn thi chất lượng của PTIT" : "Quản lý các tài liệu học tập bạn đã tải lên hệ thống"}</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openUploadModal}
                        className="btn-upload-doc"
                    >
                        Đăng tài liệu
                    </Button>
                </div>

                {/* Filter and Search Bar */}
                {activeTab === 'repo' && (
                    <div className="doc-search-filter-bar">
                        <Input
                            placeholder="Tìm kiếm tài liệu theo tiêu đề hoặc người đăng..."
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            value={searchText}
                            onChange={handleSearch}
                            allowClear
                            className="doc-search-input"
                        />
                    </div>
                )}

                {/* Main Documents Grid */}
                {loading ? (
                    <div className="doc-loading-container">
                        <Spin size="large" />
                        <p style={{ marginTop: '10px', color: '#8c8c8c' }}>Đang tải danh sách tài liệu...</p>
                    </div>
                ) : filteredDocuments.length > 0 ? (
                    <div className="doc-grid-layout">
                        {filteredDocuments.map(doc => (
                            <Card
                                key={doc.id}
                                className="doc-item-card"
                                cover={
                                    <div className="doc-card-banner" style={{
                                        backgroundImage: `url(${doc.ImageURL || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop'})`
                                    }}>
                                        <div className="doc-banner-icon">
                                            {getFileIcon(doc.fileURL)}
                                        </div>
                                    </div>
                                }
                            >
                                <div className="doc-card-body">
                                    <h3 className="doc-card-title" title={doc.title}>{doc.title}</h3>
                                    <div className="doc-card-info">
                                        {activeTab === 'repo' && (
                                            <p><strong>Người gửi:</strong> {doc.uploaderName}</p>
                                        )}
                                        <p><strong>Thời gian:</strong> {doc.createdAt || "N/A"}</p>
                                        <p><strong>Dung lượng:</strong> {doc.size || "N/A"}</p>
                                    </div>
                                    {activeTab === 'repo' ? (
                                        <Button
                                            type="primary"
                                            icon={<DownloadOutlined />}
                                            onClick={() => handleDownload(doc.fileURL)}
                                            className="btn-download-doc"
                                        >
                                            Tải xuống
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDelete(doc.id)}
                                            className="btn-delete-doc-bottom"
                                        >
                                            Xóa tài liệu
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="doc-empty-container">
                        <Empty description="Không tìm thấy tài liệu nào phù hợp" />
                    </div>
                )}
            </div>

            <Footer />

            {/* Upload Document Modal */}
            <Modal
                title={<span className="upload-modal-title">Đăng tài liệu học tập mới</span>}
                open={showModal}
                onCancel={() => !isSubmitting && setShowModal(false)}
                footer={null}
                width={500}
                centered
            >
                <div className="upload-modal-body">
                    <div className="upload-field">
                        <label>Tiêu đề tài liệu <span className="req">*</span></label>
                        <Input
                            value={docTitle}
                            onChange={(e) => setDocTitle(e.target.value)}
                            placeholder="Ví dụ: Đề cương môn Giải tích 1"
                            maxLength={150}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* File Upload Selector */}
                    <div className="upload-field">
                        <label>File tài liệu (PDF, DOC, DOCX) <span className="req">*</span></label>
                        <div className="file-uploader-box" onClick={() => !isSubmitting && fileInputRef.current?.click()}>
                            <InboxOutlined className="upload-box-icon" />
                            <p>{docFile ? docFile.name : "Chọn file tài liệu để tải lên máy chủ"}</p>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Background/Thumbnail Upload Selector */}
                    <div className="upload-field">
                        <label>Ảnh bìa tài liệu (Tùy chọn)</label>
                        <div className="image-uploader-box" onClick={() => !isSubmitting && imageInputRef.current?.click()}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Background preview" className="image-preview" />
                            ) : (
                                <>
                                    <PlusOutlined className="upload-box-icon" />
                                    <p>Tải ảnh bìa tài liệu lên</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={imageInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="upload-modal-actions">
                        <Button onClick={() => setShowModal(false)} disabled={isSubmitting}>
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={isSubmitting}
                            disabled={!docTitle.trim() || !docFile}
                            style={{ backgroundColor: '#b71c1c', borderColor: '#b71c1c' }}
                        >
                            Đăng tài liệu
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default DocumentPage;
