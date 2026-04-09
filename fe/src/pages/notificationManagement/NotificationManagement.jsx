import React, {useState} from "react";
import { Button, Input, Table, Popconfirm, Flex } from "antd";
import { SearchOutlined, PlusOutlined} from "@ant-design/icons"
import { data } from "react-router-dom";
import NoticeCreate from "../../components/noticeCreate/noticeCreate";

function NotificationManagement(){
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            userName: "user01",
            content: "Bạn đã đăng ký tài khoản thành công.",
            isRead: true,
            createAt: "2026-04-01T08:30:00"
        },
        {
            id: 2,
            userName: "user02",
            content: "Bài viết của bạn đã được phê duyệt.",
            isRead: false,
            createAt: "2026-04-01T09:15:00"
        },
        {
            id: 3,
            userName: "user03",
            content: "Bạn có bình luận mới trên bài viết.",
            isRead: false,
            createAt: "2026-04-02T10:00:00"
        },
        {
            id: 4,
            userName: "user01",
            content: "Mật khẩu của bạn đã được thay đổi.",
            isRead: true,
            createAt: "2026-04-02T11:45:00"
        },
        {
            id: 5,
            userName: "user04",
            content: "Bạn đã nhận được một tin nhắn mới.",
            isRead: false,
            createAt: "2026-04-03T08:20:00"
        },
        {
            id: 6,
            userName: "user05",
            content: "Tài khoản của bạn đã được cập nhật.",
            isRead: true,
            createAt: "2026-04-03T09:10:00"
        },
        {
            id: 7,
            userName: "user02",
            content: "Bạn có thông báo hệ thống mới.",
            isRead: false,
            createAt: "2026-04-03T14:30:00"
        },
        {
            id: 8,
            userName: "user03",
            content: "Đơn hàng của bạn đã được xác nhận.",
            isRead: true,
            createAt: "2026-04-04T08:00:00"
        },
        {
            id: 9,
            userName: "user04",
            content: "Bạn đã được thêm vào nhóm mới.",
            isRead: false,
            createAt: "2026-04-04T10:40:00"
        },
        {
            id: 10,
            userName: "user05",
            content: "Hệ thống sẽ bảo trì vào ngày mai.",
            isRead: false,
            createAt: "2026-04-05T07:50:00"
        }
    ]);

    const [searchText, setSearchText] = useState("");
    const [filterKeyWord, setFilterKeyWord] = useState("");
    const [popup, setPopup] = useState(false);
    const [data, setData] = useState({});
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
            dataIndex: "userName",
            key: "userName"
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

    const handleSaveData = (notice)=>{
        console.log(notice)

        setNotifications([...notifications,{...notice,id: notifications.length+1}]);
    }

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
    "userName"
    ];

    const filteredNotifications = notifications.filter((notice) => {
        const keyword = removeVietnameseTones(searchText);

        return searchableColumns.some((column) =>
            removeVietnameseTones(notice[column]).includes(keyword)
        );
    });

    return(
        <div className="notice-manager-container" 
            style={{backgroundColor:"#f4f4fc",
                height:"100vh",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"column",
                gap:"10px",
                padding:"30px"
            }}>
            <div className="filter-container" style={{width:"100%",display:"flex"}}>
                <Input 
                    type="text" 
                    placeholder="Nhập từ khóa"
                    value={filterKeyWord}
                    onChange={(e)=> setFilterKeyWord(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setSearchText(filterKeyWord)}
                    style={{
                        width:"500px",
                        borderRadius:"5px",
                        outline:"none",
                        padding:"5px 10px",
                        border: "1px solid #ccc",
                    }}
                />
                <Button icon={<SearchOutlined/>} 
                    size="large" 
                    type="primary" 
                    onClick={()=>setSearchText(filterKeyWord)}
                    style={{
                        height:35,
                        borderRadius:"5px", 
                        marginLeft:10,
                    }}>
                    Tìm kiếm
                </Button>

                <Button icon={<PlusOutlined/>}
                    size="large" 
                    type="primary" 
                    onClick={()=>setPopup(true)}
                    style={{
                        height:35,
                        borderRadius:"5px", 
                        marginLeft:10,
                        backgroundColor:"#4db8ff",
                        marginLeft:"auto"
                    }}>
                    Thêm thông báo</Button>
                    {
                        popup && 
                        <NoticeCreate 
                            onClose={()=> setPopup(false)}
                            onSubmit={handleSaveData}
                        />
                    }
            </div>
            
            <div className="list-pages-container"
                style={{
                    width: "100%",
                    height: "100%",
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