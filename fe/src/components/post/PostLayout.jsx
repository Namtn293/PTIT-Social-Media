import "./PostLayout.css";
import { useState, useEffect } from "react";
import { Popover, Badge, Spin, Tooltip } from "antd"; // Thêm Tooltip để xem giờ chi tiết
import { 
    LikeOutlined, CommentOutlined, SaveOutlined, 
    FlagOutlined, UserOutlined, MailOutlined, 
    IdcardOutlined, ReadOutlined 
} from "@ant-design/icons";
import useInfoApi from "../../api/UserInfoApi";

// Cấu hình Dayjs để hiển thị tiếng Việt và thời gian tương đối
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; 
dayjs.extend(relativeTime);
dayjs.locale("vi");

const PostLayout = ({ report, content, avatar, title, name, time, userName, classes, likes, comments, saves }) => {
    const [likeCount, setLikeCount] = useState(likes);
    const [liked, setLiked] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await useInfoApi.getUserInfo(userName);
                setUserData(response.data.data);
            } catch (err) {
                console.log("Lỗi lấy dữ liệu " + err);
            }
        };
        if (userName) fetchUserInfo();
    }, [userName]);

    // Hàm format thời gian thông minh
    const getFriendlyTime = (dateStr) => {
        if (!dateStr) return "";
        const postDate = dayjs(dateStr);
        const now = dayjs();
        // Nếu bài đăng trong vòng 7 ngày thì hiện "X ngày trước", nếu cũ hơn thì hiện ngày tháng
        return now.diff(postDate, 'day') < 7 ? postDate.fromNow() : postDate.format("DD/MM/YYYY");
    };

    const detailProfile = (
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
                        <span style={{ fontWeight: 600, color: "#262626" }}>{classes || "N/A"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <ReadOutlined style={{ color: "#595959", fontSize: "16px", width: "25px" }} />
                        <span style={{ color: "#8c8c8c", width: "80px" }}>Ngành:</span>
                        <span style={{ fontWeight: 600, color: "#262626" }}>{userData?.major || "Chưa cập nhật"}</span>
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            )}
        </div>
    );

    return (
        <div className="post-card">
            <div className="post-header">
                <Popover
                    styles={{ body: { borderRadius: '12px', padding: '10px' } }} // Đã sửa overlayInnerStyle thành styles.body
                    content={detailProfile}
                    trigger="click"
                    placement="right"
                    arrow={true}
                >
                    <Badge>
                        {/* Thay link ảnh lỗi bằng ảnh placeholder hoặc link ổn định hơn */}
                        <img 
                            className="avatar" 
                            src={avatar || "https://tse3.mm.bing.net/th/id/OIP.aCwqDO1MIaS3qzA7DyFPdAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"} 
                            alt="avatar" 
                            style={{ cursor: "pointer" }} 
                        />
                    </Badge>
                </Popover>
                <div className="user-info">
                    <div className="name-time">
                        <span className="name-post">{name}</span>
                        {/* FIX: Chỉ hiện dấu chấm nếu có classes */}
                        {classes && <span className="classes-post"> • {classes}</span>}
                        {/* FIX: Hiển thị thời gian đẹp + Tooltip khi di chuột vào sẽ thấy giờ chi tiết */}
                        {time && (
                            <Tooltip title={dayjs(time).format("HH:mm:ss DD/MM/YYYY")}>
                                <span className="time-post"> • {getFriendlyTime(time)}</span>
                            </Tooltip>
                        )}
                    </div>
                    <span className="post-title">{title}</span>
                </div>
            </div>

            <div className="post-content">{content}</div>

            <div className="post-actions">
                <div className={`action ${liked ? "active" : ""}`} onClick={handleLike} style={{ marginLeft: "10px" }}>
                    <LikeOutlined />
                    <span>{likeCount}</span>
                </div>
                
                {/* Đã bỏ Popover dư thừa xung quanh Comment */}
                <div className="action post-comment" style={{ marginLeft: "20px", cursor: "pointer" }}>
                    <CommentOutlined />
                    <span> {comments}</span>
                </div>

                <div className="action post-save" style={{ marginLeft: "20px" }}>
                    <SaveOutlined />
                    <span> {saves}</span>
                </div>
                <div className="action post-report" style={{ marginLeft: "20px" }}>
                    <FlagOutlined />
                    <span> {report}</span>
                </div>
            </div>
        </div>
    );
};

export default PostLayout;