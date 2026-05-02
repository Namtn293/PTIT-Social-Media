import { ConfigProvider } from 'antd'
import './App.css'
import LoginPage from "./pages/login/LoginPage"
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import RegisterPage from './pages/register/RegisterPage';
import Header from './components/header/HeaderUser';
import SideBar from './components/sidebar/SideBar';
import PageContent from './components/pagecontent/PageContent';
import HeaderAdmin from './components/header/HeaderAdmin';
import { NotificationProvider } from './context/NotificationContext';
function App() {
const theme={
    token:{
        fontFamily:"Typography",
        borderRadius:12,
    },
};

return (
    <ConfigProvider theme={theme}>
        <NotificationProvider> {/* 1. Mở NotificationProvider */}
            <BrowserRouter>
                <div className='app-container'>
                    <Routes>
                        <Route path="/*" element={
                            localStorage.getItem("role") == "ROLE_ADMIN" ? (
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
                                <div style={{
                                    justifyContent: "center",
                                    display: "flex"
                                }}>
                                    <Header />
                                    <PageContent />
                                </div>
                            )
                        } />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/register' element={<RegisterPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </NotificationProvider> 
    </ConfigProvider>
)
}
export default App;