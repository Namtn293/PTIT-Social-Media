import "./PostLayout.css"
import  { useState, useEffect } from "react";
import { Popover, Badge, Spin } from "antd";
import { LikeOutlined, CommentOutlined, SaveOutlined, FlagOutlined,UserOutlined, MailOutlined, IdcardOutlined, ReadOutlined,} from "@ant-design/icons"
import useInfoApi from "../../api/UserInfoApi"

const PostLayout = ({report,content,avatar,title,name,time,userName,classes,likes,comments,saves})=>{
    const [likeCount, setLikeCount] = useState(likes);
    const [liked, setLiked] = useState(false);
    const [userData,setUserData] = useState(null); 

    const handleLike = () => {
        if (liked) {
            setLikeCount(likeCount-1);
        } else {
            setLikeCount(likeCount+1);
        }
        setLiked(!liked);
    };
    
    useEffect(()=>{
        const fetchUserInfo=async ()=>{
            try{
                const response=await useInfoApi.getUserInfo(userName);
                setUserData(response.data.data);
            } catch(err){
                console.log("Lỗi lấy dữ liệu "+err);
            }
        };
        if (userName) {
            fetchUserInfo();
        }
    },[userName]);

    const formatTimeAgo = (time) => {
    const now = new Date();
    const diffMs = now - new Date(time);

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) {
        return "Vừa xong";
    }

    if (minutes < 60) {
        return `${minutes} phút trước`;
    }

    if (hours < 24) {
        return `${hours} giờ trước`;
    }

    return `${days} ngày trước`;
    };

    const detailProfile=(
        <div style={{ width: "280px", padding: "8px" }}>
            <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "10px", marginBottom: "15px" }}>
                <div style={{ fontWeight: 700, fontSize: "18px", color: "#b71c1c" }}>Thông tin sinh viên</div>
            </div>

            {userData ? (
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
                        <span style={{ fontWeight: 600, color: "#262626" }}>{classes}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <ReadOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Ngành:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>{userData?.major || "Chưa cập nhật"}</span>
                    </div>

                </div>
            ):(
                <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            )}
        </div>
    );

    return(
        <div className="post-card">
            <div className="post-header">
                <Popover 
                    overlayInnerStyle={{ borderRadius: '12px', padding: '10px' }} // Đã thêm bo góc cho Popover
                    content={detailProfile}
                    trigger="click"
                    placement="right"
                    arrow={true}
                >
                    <Badge>
                        <img className="avatar" src={avatar || "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-12.jpg"}  alt="avatar" style={{cursor: "pointer"}}/>
                    </Badge>
                </Popover>
                <div className="user-info">
                    <div className="name-time">
                        <span className="name-post">{name}</span>
                        <span className="classes-post">• {classes}</span>
                        <span className="time-post">• {formatTimeAgo(time)}</span>
                    </div>

                    <span className="post-title">{title}</span>
                </div>
            </div>
            
            <div className="post-content">
                {content}
            </div>

            <div className="post-actions">
                <div style={{marginLeft:"10px"}} className={`action ${liked ? "active" : ""}`}
                onClick={handleLike}>
                    <LikeOutlined></LikeOutlined>
                    <span>{likeCount}</span>
                </div>
                <Popover >
                    <div style={{marginLeft:"20px",cursor:"pointer"}} className="post-comment">
                        <CommentOutlined></CommentOutlined>
                        <span> {comments}</span>
                    </div>
                </Popover>
                <div style={{marginLeft:"20px"}} className="post-save"
                >
                    <SaveOutlined></SaveOutlined>
                    <span> {saves}</span>
                </div>
                <div style={{marginLeft:"20px"}} className="post-report"
                >
                    <FlagOutlined></FlagOutlined>
                    <span> {report}</span>
                </div>
            </div>
        </div>
    )
}
export default PostLayout;