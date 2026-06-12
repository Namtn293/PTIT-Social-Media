import React from 'react';
import HeaderUser from '../../components/header/HeaderUser';
import Footer from '../../components/footer/Footer';
import './DocumentPage.css';

function DocumentPage() {
    return (
        <div>
            <HeaderUser />
            <div className="document-page-container">
                <div className="document-content">
                    <h2>Tài liệu</h2>
                    <p>Trang tài liệu đang được phát triển...</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DocumentPage;
