import "./Community.css"
import { Button, Input,Spin } from "antd"
import { useState, useEffect, useRef } from "react"
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons"
import MessageContent from "../../components/message/MessageContent"
import { jwtDecode } from "jwt-decode"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import MessageApi from "../../api/MessageApi"

function Community() {
    const [messages, setMessages] = useState([])
    const [onlineTotal, setOnlineTotal] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const stompClientRef = useRef(null);
    const messageEndRef = useRef(null);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MessageApi.getAll();
                setMessages(response.data.data);
                console.log(messages);
            } catch (err) {
                console.log("Lỗi load tin nhắn " + err);
            } finally {
                setIsLoading(false);
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
                    setMessages((prev) => [...(prev||[]), newMessage]);
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
        const messageDTO = { userId: localStorage.getItem("userId"), content: inputValue };
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

    return (
        <div className="community-container">
            <div className="main-message-position">
                <div className="message-position">
                    <div style={{ marginLeft: "10px",fontWeight:"600",fontSize:"22px",padding:"10px" }}>Góc thông tin PTIT</div>
                    <div className="message-content">
                        {isLoading ? (
                            <div style={{ display: "flex",justifyContent:"center",alignItems:"center",height: "100%" }}>
                                <Spin tip="Đang tải tin nhắn..." size="large" />
                            </div>
                        ) : (
                            <>
                                {messages?.map((item, index) => {
                                    return <MessageContent
                                        key={index}
                                        avatar={item.avatar || "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-12.jpg"}
                                        name={item.fullName}
                                        message={item.content}
                                        timestamp={item.timestamp}
                                        check={item.userId == localStorage.getItem("userId")}
                                        userName={item.userName}
                                    />
                                })}
                                <div ref={messageEndRef} />
                            </>
                        )}
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