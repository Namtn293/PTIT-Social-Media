import "./HeaderUser.css"
import {
    BellOutlined,
    FormOutlined,
    HomeOutlined,
    WechatWorkOutlined,
    BookOutlined
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";
import { Button, Badge, Popover, List, Avatar } from "antd";

function HeaderUser() {
    const navigate = useNavigate();
    const location = useLocation();

    const titleMap = {
        "/": "Trang chủ",
        "/bai-viet": "Bài viết",
        "/cong-dong": "Cộng đồng",
        "/tai-lieu": "Tài liệu",
    };

    const title = titleMap[location.pathname] || "Trang chủ";

    const data = [
        {
            title: "Thông báo mới",
            description: "Bạn có bài viết mới cần xem"
        },
        {
            title: "Cộng đồng",
            description: "Có người vừa bình luận bài viết của bạn"
        }
    ];

    const onFinish = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const notificationContent = (
        <div style={{ padding: "0px" }}>
            <h3 style={{ marginBottom: "8px", marginTop: "0px" }}>
                Thông báo mới
            </h3>

            <div
                style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    width: "300px"
                }}
                className="notification-container"
            >
                {data.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item
                                className="notification-item"
                                style={{
                                    cursor: "pointer",
                                    padding: "10px"
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            icon={<BellOutlined />}
                                            style={{
                                                backgroundColor: "#fd4e57"
                                            }}
                                        />
                                    }
                                    title={item.title}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <div style={{ textAlign: "center" }}>
                        Không có thông báo
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <div
                className="header-wrap"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "20px",
                    backgroundColor: "white"
                }}
            >
                
                <div
                    className="menu-wrap"
                    style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent:"space-between"
                    }}
                >
                    <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <img
                        src="https://career.gpo.vn/uploads/images/truong-hoc/logo-hoc-vien-cong-nghe-buu-chinh-vien-thong-1-.jpg"
                        alt="logo"
                        style={{ height: "50px" }}
                        />
                        <div className="logo-title" style={{fontSize:"20px", marginLeft:"10px"}}>
                            PTIT STUDY
                        </div>
                    </div>
                    
                    <div
                        style={{
                        marginLeft:"400px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center"
                    }}
                    >
                        <div
                        className={`home ${location.pathname === "/" ? "active" : ""}`}
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                        >
                        <HomeOutlined /> Trang chủ
                        </div>

                        <div
                            className={`post ${location.pathname === "/bai-viet" ? "active" : ""}`}
                            onClick={() => navigate("/bai-viet")}
                            style={{ cursor: "pointer" }}
                        >
                            <FormOutlined /> Bài viết
                        </div>

                        <div
                            className={`community ${location.pathname === "/cong-dong" ? "active" : ""}`}
                            onClick={() => navigate("/cong-dong")}
                            style={{ cursor: "pointer" }}
                        >
                            <WechatWorkOutlined /> Cộng đồng
                        </div>

                        <div
                            className={`document ${location.pathname === "/tai-lieu" ? "active" : ""}`}
                            onClick={() => navigate("/tai-lieu")}
                            style={{ cursor: "pointer" }}
                        >
                            <BookOutlined /> Tài liệu
                        </div>
                    </div>
                    
                </div>

                
                <div
                    className="right-wrap"
                    style={{
                        display: "flex",
                        gap: "30px",
                        alignItems: "center"
                    }}
                >
                    <Popover
                        content={notificationContent}
                        trigger="click"
                        placement="bottom"
                        arrow={true}
                    >
                        <Badge count={data.length}>
                            <div className="bell">
                                <BellOutlined />
                            </div>
                        </Badge>
                    </Popover>

                    <img
                        className="avatar"
                        src={localStorage.getItem("userAvatar") || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                        alt="avatar"
                        style={{ height: "50px",borderRadius:"50%" }}
                    />

                    <Button
                        type="primary"
                        onClick={onFinish}
                        style={{
                            backgroundColor: "#ff4d4f",
                            width: "100px",
                            borderRadius: "5px"
                        }}
                    >
                        Đăng xuất
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default HeaderUser;