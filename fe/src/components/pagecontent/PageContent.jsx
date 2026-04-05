import { Route, Routes } from "react-router-dom";
import HomeContent from "../../pages/home/HomeContent";
import UserManagement from "../../pages/userManagement/UserManagement";
import Community from "../../pages/community/Community";
import PostManagement from "../../pages/postManagement/PostManagement"
import NotificationManagement from "../../pages/notificationManagement/NotificationManagement"

function PageContent(){
    return (
        <Routes>
            {/* Dành cho home của admin và user */}
            <Route path="/" element={<HomeContent/>}/>
            <Route path="/nguoi-dung" element={<UserManagement/>}/>
            <Route path="/cong-dong" element={<Community/>}/>
            <Route path="/bai-viet" element={<PostManagement/>}/>
            <Route path="/quan-ly-thong-bao" element={<NotificationManagement/>}/>
        </Routes>
    )
}

export default PageContent;