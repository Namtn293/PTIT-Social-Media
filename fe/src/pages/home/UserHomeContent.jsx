import React from 'react';
import { Button } from 'antd';
import { BookOutlined, TeamOutlined, BulbOutlined } from '@ant-design/icons';
import Footer from '../../components/footer/Footer';
import './UserHomeContent.css';

function UserHomeContent() {
    return (
        <div className="homepage-container">
            {/* 1. HERO BANNER SECTION */}
            <div className="hero-section" style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('https://career.gpo.vn/uploads/images/truong-hoc/logo-hoc-vien-cong-nghe-buu-chinh-vien-thong-1-.jpg')` 
            }}>
                <div className="hero-content">
                    <h1>KHÁM PHÁ THẾ GIỚI TRI THỨC TẠI<br />PTIT STUDY</h1>
                    <p>Cổng thông tin hỗ trợ học tập, nghiên cứu và kết nối cộng đồng sinh viên Học viện Công nghệ Bưu chính Viễn thông.</p>
                    <div className="hero-buttons">
                        <Button type="primary" size="large" className="btn-danger-ptit">
                            BẮT ĐẦU NGAY
                        </Button>
                        <a href="#intro" className="link-more">Tìm hiểu thêm</a>
                    </div>
                </div>
            </div>

            {/* 2. GIỚI THIỆU CHUNG SECTION */}
            <div id="intro" className="intro-section">
                <h2>GIỚI THIỆU CHUNG</h2>
                
                <div className="intro-grid">
                    {/* Phần nội dung & biểu tượng */}
                    <div className="intro-text-side">
                        <div className="features-container">
                            <div className="feature-item">
                                <BookOutlined className="feature-icon" />
                                <span>Library</span>
                            </div>
                            <div className="feature-item">
                                <TeamOutlined className="feature-icon" />
                                <span>Collaboration</span>
                            </div>
                            <div className="feature-item">
                                <BulbOutlined className="feature-icon" />
                                <span>Knowledge</span>
                            </div>
                        </div>
                        <p className="intro-description">
                            Chúng tôi cung cấp nền tảng chia sẻ tài liệu, bài giảng chất lượng, 
                            thảo luận sôi nổi và cập nhật tin tức học thuật mới nhất cho sinh viên PTIT.
                        </p>
                    </div>

                    {/* Phần 2 ảnh minh họa bên phải */}
                    <div className="intro-images-side">
                        <div className="img-wrapper">
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80" alt="Students studying" />
                        </div>
                        <div className="img-wrapper">
                            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80" alt="Discussion" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. FOOTER SECTION */}
            <Footer />
        </div>
    );
}

export default UserHomeContent;