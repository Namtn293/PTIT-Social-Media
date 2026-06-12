import HeaderUser from "../../components/header/HeaderUser";
import UserHomeContent from "./UserHomeContent";

function HomePage(){
    return (
        <div style={{width: "100%"}}>
            <HeaderUser />
            <UserHomeContent />
        </div>
    );
}

export default HomePage;