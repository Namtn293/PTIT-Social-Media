import { Route, Routes } from "react-router-dom";
import PostUser from "../../pages/post/PostUser";
import Community from "../../pages/community/Community";
import HomeContentUser from "../../pages/home/HomeContentUser";
import Document from "../../pages/document/document";
function PageContentUser(){
    return (
        <Routes>
            <Route path="/" element={<HomeContentUser/>}/>
            <Route path="/bai-viet" element={<PostUser/>}/>
            <Route path="/cong-dong" element={<Community/>}/>
            <Route path="/tai-lieu" element={<Document/>}/>
        </Routes>
    )
}

export default PageContentUser;