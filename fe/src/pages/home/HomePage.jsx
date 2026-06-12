import React from 'react';
import HeaderUser from "../../components/header/HeaderUser";
import UserHomeContent from "./UserHomeContent";
import Footer from "../../components/footer/Footer";

function HomePage(){
    return (
        <div style={{width: "100%"}}>
            <HeaderUser />
            <UserHomeContent />
            <Footer />
        </div>
    );
}

export default HomePage;