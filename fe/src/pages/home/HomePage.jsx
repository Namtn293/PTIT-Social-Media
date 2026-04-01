import Header from "../../components/header/HeaderUser";
import PageContent from "../../components/pagecontent/PageContent";
import SideBar from "../../components/sidebar/SideBar";
import HomeContent from "./HomeContent";

function homePage(){
return  (<BrowserRouter>
            <Routes>
                <Route path='/*' element={
                    localStorage.getItem("role")=="ROLE_ADMIN"?(
                        <div style={{backgroundColor:"white"}}>
                            <SideBar/>
                            
                            <PageContent/>
                        </div>
                    ):(
                        <div>
                            <Header/>
                            
                            <PageContent/>
                        </div>
                    )
                } />
            </Routes>
        </BrowserRouter>)
}

export default homePage;