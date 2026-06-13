import React from 'react';
import HeaderUser from '../../components/header/HeaderUser';
import Community from './Community';
import './CommunityPage.css';

function CommunityPage() {
    return (
        <div className="community-page-layout">
            <HeaderUser />
            <Community />
        </div>
    );
}

export default CommunityPage;
