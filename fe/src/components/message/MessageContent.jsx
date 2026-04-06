import { useState } from "react";
import { Popover, Spin, Button } from "antd";
import {
    UserOutlined, MailOutlined, IdcardOutlined, ReadOutlined,
    MessageOutlined, ProfileOutlined
} from "@ant-design/icons";
import useInfoApi from "../../api/UserInfoApi";

const MessageContent = ({check, avatar, name, timestamp, message, userName}) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenChange = async (open) => {
        if (open && !userData && userName) {
            setIsLoading(true);
            try {
                const response = await useInfoApi.getUserInfo(userName);
                setUserData(response.data.data);
            } catch (err) {
                console.log("Lỗi lấy dữ liệu: " + err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const detailProfile = (
        <div style={{ width: "280px", padding: "8px" }}>
            <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "10px", marginBottom: "15px" }}>
                <div style={{ fontWeight: 700, fontSize: "18px", color: "#b71c1c" }}>Thông tin sinh viên</div>
            </div>

            {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            ) : userData ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <UserOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Họ và tên:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>{name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <MailOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Email:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>{userData?.email || "Chưa cập nhật"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <IdcardOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Lớp:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>Chưa cập nhật</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <ReadOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Ngành:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>{userData?.major || "Chưa cập nhật"}</span>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: "center", color: "gray", padding: "10px" }}>Không thể tải dữ liệu</div>
            )}
        </div>
    );

    return (
        <>
            {!check ? (
                // Tin nhắn của người khác (bên trái)
                <div style={{marginBottom:"20px",marginLeft:"20px",display:"flex",flexDirection:"row",marginTop:"10px",alignItems:"center"}}>
                    
                    {/* Wrap Avatar vào Popover, mở sang bên Phải */}
                    <Popover overlayInnerStyle={{ borderRadius: '12px', padding: '10px' }} content={detailProfile} trigger="click" placement="rightTop" arrow={true} onOpenChange={handleOpenChange}>
                        <img src={avatar} alt="avatar" style={{cursor:"pointer",height:"34px",width:"34px",borderRadius:"50%",marginTop:"5px",marginBottom:"auto"}} />
                    </Popover>
                    
                    <div style={{backgroundColor:"white",marginLeft:"15px",display:"flex",flexDirection:"column",paddingLeft:"10px",paddingRight:"10px",borderRadius:"7px",paddingTop:"5px",paddingBottom:"5px",maxWidth:"500px"}}>
                        <div style={{fontSize:"12px",color:"rgb(110, 110, 110)"}}>{name}</div>
                        <div style={{fontSize:"15px",color:"rgb(0, 0, 0)"}}>{message}</div>
                        <div style={{marginTop:"4px",fontSize:"10px",color:"rgb(110, 110, 110)"}}>{timestamp}</div>
                    </div>
                </div>
            ) : (
                <div style={{marginBottom:"20px",marginRight:"20px",display:"flex",flexDirection:"row",marginTop:"10px",alignItems:"center",justifyContent:"end"}}>
                    <div style={{backgroundColor:"white",marginRight:"15px",display:"flex",flexDirection:"column",paddingLeft:"10px",paddingRight:"10px",borderRadius:"7px",paddingTop:"5px",paddingBottom:"5px",maxWidth:"500px"}}>
                        <div style={{fontSize:"12px",color:"rgb(110, 110, 110)"}}>{name}</div>
                        <div style={{fontSize:"15px",color:"rgb(0, 0, 0)"}}>{message}</div>
                        <div style={{marginTop:"4px",fontSize:"10px",color:"rgb(110, 110, 110)"}}>{timestamp}</div>
                    </div>
                    
                    <Popover overlayInnerStyle={{ borderRadius: '12px', padding: '10px' }} content={detailProfile} trigger="click" placement="leftTop" arrow={true} onOpenChange={handleOpenChange}>
                        <img src={avatar} alt="avatar" style={{cursor:"pointer",height:"34px",width:"34px",borderRadius:"50%",marginTop:"5px",marginBottom:"auto"}} />
                    </Popover>

                </div>  
            )}
        </>
    )
}

export default MessageContent;