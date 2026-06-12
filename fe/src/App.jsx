import { ConfigProvider } from 'antd'
import './App.css'
import LoginPage from "./pages/login/LoginPage"
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './pages/register/RegisterPage';
import SideBar from './components/sidebar/SideBar';
import PageContent from './components/pagecontent/PageContent';
import HeaderAdmin from './components/header/HeaderAdmin';
import HomePage from './pages/home/HomePage';
import PostPage from './pages/post/PostPage';
import CommunityPage from './pages/community/CommunityPage';
import DocumentPage from './pages/document/DocumentPage';
function App() {
const theme={
    token:{
        fontFamily:"Typography",
        borderRadius:12,
    },
};

return (
    <ConfigProvider theme={theme}>
        <BrowserRouter>
            <div className='app-container'>
                <Routes>
                    <Route path='/login' element={<LoginPage/>} />
                    <Route path='/register' element={<RegisterPage/>} />
                    <Route path="/*" element={
                        !localStorage.getItem("token") ? (
                            <Navigate to="/login" replace />
                        ) : localStorage.getItem("role") === "ROLE_ADMIN" ? (
                            <div style={{
                                justifyContent:"center",
                                display:"flex",
                                width:"100vw",
                                height:"100vh"
                            }}>
                                <SideBar/>
                                <div className='in-content'>
                                    <HeaderAdmin/>
                                    <PageContent/>
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
                    }/>
                </Routes>
            </div>
        </BrowserRouter>
    </ConfigProvider>
)
}

export default App