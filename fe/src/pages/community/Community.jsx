import "./Community.css"
import {Button, Input} from "antd"
import {useState} from "react"
import {PaperClipOutlined,SendOutlined} from "@ant-design/icons"
import PostLayout from "../../components/post/PostLayout"
import MessageContent from "../../components/message/MessageContent"

function Community(){
    const [onlineTotal,setOnlineTotal]=useState(0);
    const memberOnline = [
    {
        id: "1",
        avatar: "https://i.pravatar.cc/150?u=1",
        name: "Trần Nhật Nam",
        classes: "D23CQCN04-B",
    },
    {
        id: "2",
        avatar: "https://i.pravatar.cc/150?u=2",
        name: "Vũ Thế Phong",
        classes: "D23CQCN06-B",
    },
    {
        id: "3",
        avatar: "https://i.pravatar.cc/150?u=3",
        name: "Lê Thị Thu Thảo",
        classes: "D23CQCN01-A",
    },
    {
        id: "4",
        avatar: "https://i.pravatar.cc/150?u=4",
        name: "Nguyễn Minh Đức",
        classes: "D23CQCN05-C",
    },
    {
        id: "5",
        avatar: "https://i.pravatar.cc/150?u=5",
        name: "Phạm Hồng Anh",
        classes: "D23CQCN02-B",
    },
    {
        id: "6",
        avatar: "https://i.pravatar.cc/150?u=6",
        name: "Hoàng Kiều Trang",
        classes: "D23CQAT01-B",
    },
    {
        id: "7",
        avatar: "https://i.pravatar.cc/150?u=7",
        name: "Đỗ Duy Mạnh",
        classes: "D23CQVT03-A",
    },
    {
        id: "8",
        avatar: "https://i.pravatar.cc/150?u=8",
        name: "Bùi Tiến Dũng",
        classes: "D23CQCN07-D",
    },
    ];


    const onlineMessage = [
    {
        id: "1",
        avatar: "https://i.pravatar.cc/150?u=11",
        name: "Nguyễn Văn Hùng",
        classes: "D23CQCN03-A",
        message: "Mọi người ơi, ai làm bài Java Spring chưa 😭",
    },
    {
        id: "2",
        avatar: "https://i.pravatar.cc/150?u=12",
        name: "Trần Minh Quân",
        classes: "D23CQCN06-B",
        message: "Bài nào thế bro, gửi xem nào",
    },
    {
        id: "3",
        avatar: "https://i.pravatar.cc/150?u=13",
        name: "Phạm Thu Hà",
        classes: "D23CQCN01-A",
        message: "T đang làm dở phần login bằng JWT nè",
    },
    {
        id: "4",
        avatar: "https://i.pravatar.cc/150?u=14",
        name: "Lê Đức Anh",
        classes: "D23CQCN05-C",
        message: "JWT khó vãi, t debug mãi không ra 😩",
    },
    {
        id: "5",
        avatar: "https://i.pravatar.cc/150?u=15",
        name: "Hoàng Hải Nam",
        classes: "D23CQCN02-B",
        message: "Ai cần code mẫu không, t share cho",
    },
    {
        id: "6",
        avatar: "https://i.pravatar.cc/150?u=16",
        name: "Đỗ Thị Mai",
        classes: "D23CQAT01-B",
        message: "Cho mình xin với ạ 🙏",
    },
    {
        id: "7",
        avatar: "https://i.pravatar.cc/150?u=17",
        name: "Vũ Thành Đạt",
        classes: "D23CQVT03-A",
        message: "Mai kiểm tra rồi mà chưa học gì luôn 💀",
    },
    {
        id: "8",
        avatar: "https://i.pravatar.cc/150?u=18",
        name: "Bùi Quang Huy",
        classes: "D23CQCN07-D",
        message: "Đi ngủ đi mai tính tiếp 😂",
    },
    {
        id: "9",
        avatar: "https://i.pravatar.cc/150?u=19",
        name: "Nguyễn Thị Lan",
        classes: "D23CQCN04-B",
        message: "Ai học frontend không, React khó quá",
    },
    {
        id: "10",
        avatar: "https://i.pravatar.cc/150?u=20",
        name: "Phan Tuấn Kiệt",
        classes: "D23CQCN06-B",
        message: "React cứ luyện hooks là quen thôi 👍",
    },
];

    return(
        <div className="community-container">
            <div style={{marginLeft:"20px",fontWeight:"600",fontSize:"22px"}}>Góc trao đổi thảo luận dành cho tất cả sinh viên</div>
            <div className="main-message-position">
                <div className="message-position">
                    <div className="message-content">
                        {onlineMessage.map((item,index) =>{
                            return <MessageContent
                            avatar={item.avatar}
                            name={item.name}
                            classes={item.classes}
                            message={item.message}
                            />
                        })}
                    </div>

                    <div className="text-message">
                        <PaperClipOutlined style={{marginRight:"10px"}}></PaperClipOutlined>
                        <Input placeholder="Nhập tin nhắn tới cộng đồng" style={{height:"40px",borderRadius:"5px"}}></Input>
                        <Button style={{boxShadow:"0 0 8px rgba(24, 144, 255, 0.2)",marginLeft:"20px",marginRight:"10px",width:"45px",height:"40px",borderRadius:"5px"}} type="primary" icon={<SendOutlined/>}></Button>
                    </div>
                </div>

                <div className="member-total">
                    <div>
                        {onlineTotal} thành viên đang online
                        <span style={{marginLeft:"5px",display:"inline-block",backgroundColor:"green",borderRadius:"50%",width:"10px",height:"10px"}}></span>    
                    </div>
                    <Input placeholder="Tìm thành viên"
                    size="large"
                        style={{height:"40px",marginTop:"10px",borderRadius:"7px"}}/>
                    {memberOnline.map((item,index)=>{
                        return <div style={{display:"flex",flexDirection:"row",marginTop:"10px",alignItems:"center"}}>
                            <img src={item.avatar} alt="avatar" style={{height:"48px",width:"48px",borderRadius:"50%",marginTop:"20px"}} />
                            <div style={{marginLeft:"20px",paddingTop:"20px"}}>
                                <div style={{fontSize:"17px",fontWeight:"600"}}>{item.name}</div>
                                <div style={{fontSize:"13px",fontWeight:"400"}}>{item.classes}</div>
                            </div>
                            <span style={{marginLeft:"5px",marginRight:"10px",marginLeft:"auto",display:"inline-block",backgroundColor:"green",borderRadius:"50%",width:"10px",height:"10px"}}></span>    
                        </div>
                    })
                    }    
                </div>
            </div>
        </div>
    )
}
export default Community;