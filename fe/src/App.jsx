import { ConfigProvider } from 'antd'
import './App.css'
import LoginPage from "./pages/login/LoginPage"
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import RegisterPage from './pages/register/RegisterPage';
import HomeContent from './pages/home/HomeContent';
import Header from './components/header/Header';
import SideBar from './components/sidebar/SideBar';
import PageContent from './components/pagecontent/PageContent';
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
                    <Route path="/*" element={
                        localStorage.getItem("role")=="ROLE_ADMIN"?(
                        <div style={{
                            justifyContent:"center",
                            display:"flex",
                            width:"100vw",
                            height:"100vh"
                        }}>
                            <SideBar/>
                            <PageContent/>
                        </div>
                    ):(
                        <div style={{
                            justifyContent:"center",
                            display:"flex"
                        }}>
                            <Header/>
                            <PageContent/>
                        </div>
                    )}/>
                    <Route path='/login' element={<LoginPage/>} />
                    <Route path='/register' element={<RegisterPage/>} />
                </Routes>
            </div>
        </BrowserRouter>
    </ConfigProvider>
)
}

export default App