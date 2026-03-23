import { ConfigProvider } from 'antd'
import './App.css'
import LoginPage from "./pages/login/LoginPage"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/register/RegisterPage';
function App() {
const theme={
    token:{
        fontFamily:"Inter",
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
                </Routes>
            </div>
        </BrowserRouter>
    </ConfigProvider>
)
}

export default App