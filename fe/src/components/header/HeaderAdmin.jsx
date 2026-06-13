import { Button } from "antd";
import "./HeaderAdmin.css"
import { useLocation, useNavigate } from "react-router-dom";

function HeaderAdmin() {
    const location = useLocation();
    const navigate = useNavigate();

    const titleMap = {
        "/": "Bảng tin",
        "/nguoi-dung": "Người dùng",
        "/bai-viet": "Bài viết",
        "/cong-dong": "Cộng đồng",
        "/bao-cao-bai-viet": "Báo cáo",
        "/quan-ly-thong-bao": "Thông báo",
    }
    const title = titleMap[location.pathname];

    const onFinish = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    }

    return (
        <div className="container-admin-header">
            <div style={{ marginRight: "auto", width: "200px", fontWeight: "500", color: "#A50000", fontSize: "27px", display: "flex" }}>{title}</div>
            <Button type="primary" onClick={onFinish}>Đăng xuất</Button>
        </div>
    )
}

export default HeaderAdmin;