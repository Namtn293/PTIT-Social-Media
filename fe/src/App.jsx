import { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import './App.css';
import LoginPage from "./pages/login/LoginPage";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './pages/register/RegisterPage';
import SideBar from './components/sidebar/SideBar';
import PageContent from './components/pagecontent/PageContent';
import HeaderAdmin from './components/header/HeaderAdmin';
import HomePage from './pages/home/HomePage';
import PostPage from './pages/post/PostPage';
import CommunityPage from './pages/community/CommunityPage';
import DocumentPage from './pages/document/DocumentPage';
import { jwtDecode } from 'jwt-decode';
import { WebSocketProvider } from './context/WebSocketContext';

// Helper to check token expiration
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

// Helper to clear authentication from storage
const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");
};

function App() {
    const theme = {
        token: {
            fontFamily: "Typography",
            borderRadius: 12,
        },
    };

    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("token");
        if (isTokenExpired(token)) {
            clearAuth();
            return { token: null, role: null };
        }
        return {
            token: token,
            role: localStorage.getItem("role")
        };
    });

    useEffect(() => {
        const handleAuthChange = () => {
            const token = localStorage.getItem("token");
            if (isTokenExpired(token)) {
                clearAuth();
                setAuth({ token: null, role: null });
            } else {
                setAuth({
                    token: token,
                    role: localStorage.getItem("role")
                });
            }
        };

        window.addEventListener("authChange", handleAuthChange);
        return () => window.removeEventListener("authChange", handleAuthChange);
    }, []);

    return (
        <ConfigProvider theme={theme}>
            <BrowserRouter>
                <WebSocketProvider token={auth.token}>
                    <div className='app-container'>
                        <Routes>
                            <Route path='/login' element={<LoginPage />} />
                            <Route path='/register' element={<RegisterPage />} />
                            <Route path="/*" element={
                                !auth.token ? (
                                    <Navigate to="/login" replace />
                                ) : auth.role === "ROLE_ADMIN" ? (
                                    <div style={{
                                        justifyContent: "center",
                                        display: "flex",
                                        width: "100vw",
                                        height: "100vh"
                                    }}>
                                        <SideBar />
                                        <div className='in-content'>
                                            <HeaderAdmin />
                                            <PageContent />
                                        </div>
                                    </div>
                                ) : (
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/bai-viet" element={<PostPage />} />
                                        <Route path="/cong-dong" element={<CommunityPage />} />
                                        <Route path="/tai-lieu" element={<DocumentPage />} />
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                )
                            } />
                        </Routes>
                    </div>
                </WebSocketProvider>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;