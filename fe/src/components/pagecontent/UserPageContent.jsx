import { Route, Routes } from "react-router-dom";
// import UserHomeContent from "../../pages/home/UserHomeContent";
import UserManagement from "../../pages/userManagement/UserManagement";
import Community from "../../pages/community/Community";
import PostManagement from "../../pages/postManagement/PostManagement"
import NotificationManagement from "../../pages/notificationManagement/NotificationManagement"

function UserPageContent(){
    return (
        <Routes>
            {/* Dành cho home của sinh vien*/}
            {/* <Route path="/" element={<UserHomeContent/>}/> */}
            <Route path="/bai-viet" element={<UserManagement/>}/>
            <Route path="/cong-dong" element={<Community/>}/>
            <Route path="/tai-lieu" element={<PostManagement/>}/>
        </Routes>
    )
}

export default UserPageContent;