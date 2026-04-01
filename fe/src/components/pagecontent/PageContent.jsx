import { Route, Routes } from "react-router-dom";
import HomeContent from "../../pages/home/HomeContent";

function PageContent(){
    return (
        <Routes>
            {/* Dành cho home của admin và user */}
            <Route path="/" element={<HomeContent/>}/>
            
            
        </Routes>
    )
}

export default PageContent;