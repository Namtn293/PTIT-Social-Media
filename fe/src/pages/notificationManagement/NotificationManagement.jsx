import React, {useState} from "react";
import { Button, Input, Table, Popconfirm } from "antd";
import { data } from "react-router-dom";

function NotificationManagement(){
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            userId: "user01",
            content: "Bạn đã đăng ký tài khoản thành công.",
            isRead: true,
            createAt: "2026-04-01T08:30:00"
        },
        {
            id: 2,
            userId: "user02",
            content: "Bài viết của bạn đã được phê duyệt.",
            isRead: false,
            createAt: "2026-04-01T09:15:00"
        },
        {
            id: 3,
            userId: "user03",
            content: "Bạn có bình luận mới trên bài viết.",
            isRead: false,
            createAt: "2026-04-02T10:00:00"
        },
        {
            id: 4,
            userId: "user01",
            content: "Mật khẩu của bạn đã được thay đổi.",
            isRead: true,
            createAt: "2026-04-02T11:45:00"
        },
        {
            id: 5,
            userId: "user04",
            content: "Bạn đã nhận được một tin nhắn mới.",
            isRead: false,
            createAt: "2026-04-03T08:20:00"
        },
        {
            id: 6,
            userId: "user05",
            content: "Tài khoản của bạn đã được cập nhật.",
            isRead: true,
            createAt: "2026-04-03T09:10:00"
        },
        {
            id: 7,
            userId: "user02",
            content: "Bạn có thông báo hệ thống mới.",
            isRead: false,
            createAt: "2026-04-03T14:30:00"
        },
        {
            id: 8,
            userId: "user03",
            content: "Đơn hàng của bạn đã được xác nhận.",
            isRead: true,
            createAt: "2026-04-04T08:00:00"
        },
        {
            id: 9,
            userId: "user04",
            content: "Bạn đã được thêm vào nhóm mới.",
            isRead: false,
            createAt: "2026-04-04T10:40:00"
        },
        {
            id: 10,
            userId: "user05",
            content: "Hệ thống sẽ bảo trì vào ngày mai.",
            isRead: false,
            createAt: "2026-04-05T07:50:00"
        }
    ]);

    const [searchText, setSearchText] = useState("");

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 70
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
        },
        {
            title: "Trạng thái",
            dataIndex: "isRead",
            key:"isRead",
            render: (status)=>{
                return status===true?"Đã đọc":"Chưa đọc"
            }
        },
        {
            title: "Người nhận",
            dataIndex: "userId",
            key: "userId"
        },
        {
            title: "Ngày gửi",
            dataIndex: "createAt",
            key: "createAt",
            render: (date)=>{
                return new Date(date).toLocaleString("vi-VN",{
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })
            }
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            render: (_,record)=>{
                return (
                    <Popconfirm
                        title="Bạn có chắc muốn xóa không?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button 
                            style={{backgroundColor:"#ff4d4f",color:"white"}}
                        >Xóa</Button>
                    </Popconfirm>
                    
                )
            }
        },
    ];

    const handleDelete = (id)=>{
        const newNotifications = notifications.filter(notice=>notice.id!==id);
        setNotifications(newNotifications);
    }

    function removeVietnameseTones(str) {
    return str
        ?.normalize("NFD")
        ?.replace(/[\u0300-\u036f]/g, "")
        ?.replace(/đ/g, "d")
        ?.replace(/Đ/g, "D")
        ?.toLowerCase()
        ?.trim();
    }

    const searchableColumns = [
    "content",
    "userId"
    ];

    const filteredNotifications = notifications.filter((notice) => {
        const keyword = removeVietnameseTones(searchText);

        return searchableColumns.some((column) =>
            removeVietnameseTones(notice[column]).includes(keyword)
        );
    });

    return(
        <div className="notice-manager-container" 
            style={{backgroundColor:"#c7c7c79f",
                height:"100vh",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"column",
                gap:"10px"
            }}>
            <div className="filter-container" style={{width:"100%"}}>
                <Input 
                    type="text" 
                    placeholder="Nhập từ khóa"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        width:"200px",
                        borderRadius:"5px",
                        outline:"none",
                        padding:"5px 10px",
                        border: "1px solid #ccc",
                        margin: "10px 0 0 65px"
                    }}
                />
            </div>
            
            <div className="list-pages-container"
                style={{
                    width: "90%",
                    height: "90%",
                    backgroundColor:"#ffffff",
                    borderRadius:"10px",
                    marginBottom:"10px"
                }}>

                <Table columns={columns}
                dataSource={filteredNotifications}
                rowKey="id"
                pagination={{
                    pageSize:7,
                    position:["bottomCenter"],
                    showLessItems: true,
                    showSizeChanger: false
                }}
                >

                </Table>

            </div>
        </div>
    )
}
export default NotificationManagement;