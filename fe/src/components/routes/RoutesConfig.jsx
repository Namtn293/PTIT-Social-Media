import { Route, Routes } from "react-router-dom";
import RegisterPage from "../../pages/register/RegisterPage";
import LoginPage from "../../pages/login/LoginPage";
function RoutesConfig(){
    return <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
    </Routes>
}
export default RoutesConfig;