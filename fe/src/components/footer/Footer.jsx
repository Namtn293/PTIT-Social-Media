import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer-section">
            <div className="footer-content">
                <div className="footer-left">
                    <div className="footer-logo">
                        <img src="https://career.gpo.vn/uploads/images/truong-hoc/logo-hoc-vien-cong-nghe-buu-chinh-vien-thong-1-.jpg" alt="PTIT Logo" />
                        <h3>PTIT STUDY</h3>
                    </div>
                    <p>📍 Km10 Nguyễn Trãi, Hà Đông, Hà Nội</p>
                    <p>✉️ info@ptit.edu.vn</p>
                    <p>📞 024-xxxx-xxxx</p>
                </div>
                
                <div className="footer-center">
                    <h4>Bản hệ</h4>
                    <ul>
                        <li><a href="/">Về chúng tôi</a></li>
                        <li><a href="/">Liên hệ</a></li>
                        <li><a href="/">Chính sách</a></li>
                    </ul>
                </div>

                <div className="footer-right">
                    <div className="social-icons">
                        <a href="#facebook" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#youtube" title="YouTube"><i className="fab fa-youtube"></i></a>
                        <a href="#linkedin" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
