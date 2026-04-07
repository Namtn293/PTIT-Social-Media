import { Avatar, Badge, Button, List, Popover } from "antd";
import "./HeaderAdmin.css"
import { useLocation, useNavigate } from "react-router-dom";
import { BellOutlined } from "@ant-design/icons"

function HeaderAdmin(){
    const location=useLocation();
    const navigate=useNavigate();

    const titleMap={
        "/":"Bảng tin",
        "/nguoi-dung":"Người dùng",
        "/bai-viet":"Bài viết",
        "/cong-dong":"Cộng đồng",
        "/bao-cao-bai-viet":"Báo cáo",
    }
    const title=titleMap[location.pathname];

    const onFinish=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("role"); 
        navigate("/login");
    }

    const data=[
        {title:"Bài viết mới đến từ clb IT",description:"1 phút trước"},
        { title: 'Báo cáo vi phạm mới', description: '1 giờ trước' },
        { title: 'Báo cáo vi phạm mới', description: '1 giờ trước' },
        {title:"Bài viết mới đến từ clb IT",description:"1 phút trước"},
        {title:"Bài viết mới đến từ clb IT",description:"1 phút trước"},
    ];

    const notificationContent=(
        <div style={{padding:"0px"}}>
            <h3 style={{marginBottom:"8px",marginTop:"0px"}}>Thông báo mới</h3>
            <div style={{maxHeight:"300px",overflowY:'auto',width:"300px"}} className="notification-container" >
            {data.length>0 ? (
                <div>
                    <List 
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item)=>(
                            <List.Item className="notification-item" style={{cursor:"pointer", padding:"10px"}}>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<BellOutlined/>} style={{backgroundColor:"#fd4e57"}}/>}
                                    description={item.description}
                                    title={item.title}
                                />
                            </List.Item>
                        )}  
                    />
                </div>
            ) : (
                <div style={{textAlign:"center"}}>Không có thông báo</div>    
            )}
            </div>
        </div>
    )

    return (
        <div className="container-admin-header">
            <div style={{marginRight:"auto",width:"200px",fontWeight:"500",color:"#A50000",fontSize:"27px",display:"flex"}}>{title}</div>
            <Popover 
                content={notificationContent}
                trigger="click"
                placement="bottom"
                arrow={true}
            >
                <Badge>
                    <BellOutlined className="bell-icon"/>
                </Badge>
            </Popover>
            <Button type="primary" onClick={onFinish}>Đăng xuất</Button>
        </div>
    )
}

export default HeaderAdmin;