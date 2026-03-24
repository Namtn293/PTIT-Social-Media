import "./SideBar.css"
import { Layout,Menu } from "antd";
const {Sider}=Layout;
import logo from "../../assets/logo.png"
import { AuditOutlined, FormOutlined, HomeOutlined, LogoutOutlined, MessageOutlined, UserOutlined }  from "@ant-design/icons"
function SideBar(){
    const menuItems=[
        {
            key:"/",
            icon:<HomeOutlined/>,
            label:"Trang chủ",
        },
        {
            key:"/nguoi-dung",
            icon:<UserOutlined/>,
            label:"Quản lý người dùng",
        },
        {
            key:"/bai-viet",
            icon:<FormOutlined/>,
            label:"Quản lý bài viết",
        },
        {
            key:"/cong-dong",
            icon:<MessageOutlined/>,
            label:"Quản lý cộng đồng",
        },
        {
            key:"/bai-cao-bai-viet",
            icon:<AuditOutlined/>,
            label:"Quản lý báo cáo",
        },
        {
            key:"/dang-xuat",
            icon:<LogoutOutlined/>,
            label:"Đăng xuất",
        },
    ]
    return (
        <div className="sidebar">
            <img src={logo} alt="logo" style={{ width: '130px',marginTop:'20px',marginLeft:"60px",marginBottom:'0px',backgroundColor:"white"}} />
            <Sider>
                <Menu 
                mode="inline"
                items={menuItems} style={{width:"250px",display:"flex",flexDirection:"column",textAlign:"left"}}>
                </Menu>
            </Sider>
        </div>
    )
}
export default SideBar;