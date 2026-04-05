import "./Community.css"
import { Button, Input } from "antd"
import { useState, useEffect, useRef } from "react"
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons"
import PostLayout from "../../components/post/PostLayout"
import MessageContent from "../../components/message/MessageContent"
import { jwtDecode } from "jwt-decode"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"


function Community() {
    const [messages, setMessages] = useState([])
    const [onlineTotal, setOnlineTotal] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const stompClientRef = useRef(null);
    const messageEndRef = useRef(null);
    const getUserId = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded.userId;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MessageApi.getAll();
                setMessages(response.data.data);
            } catch (err) {
                console.log("Lỗi load tin nhắn " + err);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            onConnect: () => {
                console.log("Đã kết nối Websocket");
                client.subscribe("/topic/public", (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            },

            onDisconnect: () => {
                console.log("Không kết nối được Websocket");
            },
        });
        client.activate();

        stompClientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!inputValue.trim()) return;
        if (!stompClientRef.current?.connected) return;
        const messageDTO = { userId: getUserId(), content: inputValue };
        stompClientRef.current.publish({
            destination: "/app/chat-community",
            body: JSON.stringify(messageDTO),
        });
        setInputValue("");
    }

    const handleKeydown = (e) => {
        if (e.key === "Enter") sendMessage();
    }

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
            timestamp: "12:30 04-04-2026",
        },
        {
            id: "2",
            avatar: "https://i.pravatar.cc/150?u=12",
            name: "Trần Minh Quân",
            classes: "D23CQCN06-B",
            message: "Bài nào thế bro, gửi xem nào",
            timestamp: "12:30 04-04-2026",
        },
        {
            id: "3",
            avatar: "https://i.pravatar.cc/150?u=13",
            name: "Phạm Thu Hà",
            classes: "D23CQCN01-A",
            message: "T đang làm dở phần login bằng JWT nè",
            timestamp: "12:30 04-04-2026",
        },
        {
            id: "4",
            avatar: "https://i.pravatar.cc/150?u=14",
            name: "Lê Đức Anh",
            classes: "D23CQCN05-C",
            message: "JWT khó vãi, t debug mãi không ra 😩",
            timestamp: "12:30 04-04-2026",
        },
        {
            id: "5",
            avatar: "https://i.pravatar.cc/150?u=15",
            name: "Hoàng Hải Nam",
            classes: "D23CQCN02-B",
            message: "Ai cần code mẫu không, t share cho",
            timestamp: "12:30 04-04-2026",
        },
        {
            id: "6",
            avatar: "https://i.pravatar.cc/150?u=16",
            name: "Đỗ Thị Mai",
            classes: "D23CQAT01-B",
            message: "Cho mình xin với ạ 🙏",
            timestamp: "12:30 04-04-2026",
        },
        {
            id: "7",
            avatar: "https://i.pravatar.cc/150?u=17",
            name: "Vũ Thành Đạt",
            classes: "D23CQVT03-A",
            message: "Mai kiểm tra rồi mà chưa học gì luôn 💀",
            timestamp: "12:30 04-04-2026",
        },
        {
            id: "8",
            avatar: "https://i.pravatar.cc/150?u=18",
            name: "Bùi Quang Huy",
            classes: "D23CQCN07-D",
            message: "Đi ngủ đi mai tính tiếp 😂",
            timestamp: "12:30 04-04-2026",
        },
        {
            id: "9",
            avatar: "https://i.pravatar.cc/150?u=19",
            name: "Nguyễn Thị Lan",
            classes: "D23CQCN04-B",
            message: "Ai học frontend không, React khó quá",
            timestamp: "12:30 04-04-2026",
        },
        {
            id: "10",
            avatar: "https://i.pravatar.cc/150?u=20",
            name: "Phan Tuấn Kiệt",
            classes: "D23CQCN06-B",
            message: "React cứ luyện hooks là quen thôi 👍",
            timestamp: "12:30 04-04-2026",
        },
    ];

    return (
        <div className="community-container">
            <div className="main-message-position">
                <div className="message-position">
                    <div style={{ marginLeft: "10px", fontWeight: "600", fontSize: "22px", padding: "10px" }}>Góc thông tin PTIT</div>
                    <div className="message-content">
                        {messages.map((item, index) => {
                            return <MessageContent
                                key={index}
                                avatar={item.avatar || "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-12.jpg"}
                                name={item.fullName}
                                message={item.content}
                                timestamp={item.timestamp}
                            />
                        })}
                        <div ref={messageEndRef} />
                    </div>

                    <div className="text-message">
                        <PaperClipOutlined style={{ marginRight: "10px" }}></PaperClipOutlined>
                        <Input onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeydown} value={inputValue} placeholder="Nhập tin nhắn tới cộng đồng" style={{ height: "40px", borderRadius: "5px" }}></Input>
                        <Button onClick={sendMessage} style={{ boxShadow: "0 0 8px rgba(24, 144, 255, 0.2)", marginLeft: "20px", marginRight: "10px", width: "45px", height: "40px", borderRadius: "5px" }} type="primary" icon={<SendOutlined />}></Button>
                    </div>
                </div>

                <div className="member-total">
                    <div>
                        {onlineTotal} thành viên đang online
                        <span style={{ marginLeft: "5px", display: "inline-block", backgroundColor: "green", borderRadius: "50%", width: "10px", height: "10px" }}></span>
                    </div>
                    <Input placeholder="Tìm thành viên"
                        size="large"
                        style={{ height: "40px", marginTop: "10px", borderRadius: "7px" }} />
                    {memberOnline.map((item, index) => {
                        return <div key={index} style={{ display: "flex", flexDirection: "row", marginTop: "10px", alignItems: "center" }}>
                            <img src={item.avatar} alt="avatar" style={{ height: "48px", width: "48px", borderRadius: "50%", marginTop: "20px" }} />
                            <div style={{ marginLeft: "20px", paddingTop: "20px" }}>
                                <div style={{ fontSize: "17px", fontWeight: "600" }}>{item.name}</div>
                                <div style={{ fontSize: "13px", fontWeight: "400" }}>{item.classes}</div>
                            </div>
                            <span style={{ marginLeft: "5px", marginRight: "10px", marginLeft: "auto", display: "inline-block", backgroundColor: "green", borderRadius: "50%", width: "10px", height: "10px" }}></span>
                        </div>
                    })
                    }
                </div>
            </div>
        </div>
    )
}
export default Community;