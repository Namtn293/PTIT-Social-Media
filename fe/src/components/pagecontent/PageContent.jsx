import { Route, Routes } from "react-router-dom";
import HomeContent from "../../pages/home/HomeContent";
import UserManagement from "../../pages/userManagement/UserManagement";

function PageContent(){
    return (
        <Routes>
            {/* Dành cho home của admin và user */}
            <Route path="/" element={<HomeContent/>}/>
            <Route path="/nguoi-dung" element={<UserManagement/>}/>
            
        </Routes>
    )
}

export default PageContent;