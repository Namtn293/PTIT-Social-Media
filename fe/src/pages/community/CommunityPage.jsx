import React from 'react';
import HeaderUser from '../../components/header/HeaderUser';
import Footer from '../../components/footer/Footer';
import Community from './Community';
import './CommunityPage.css';

function CommunityPage() {
    return (
        <div className="community-page-layout">
            <HeaderUser />
            <Community />
            <Footer />
        </div>
    );
}

export default CommunityPage;
