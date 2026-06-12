import "./Community.css"
import { Input, Spin } from "antd"
import { useState, useEffect, useRef } from "react"
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons"
import MessageContent from "../../components/message/MessageContent"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import MessageApi from "../../api/MessageApi"

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

const parseTimestamp = (timestampStr) => {
    if (!timestampStr) return new Date(0);
    const parts = timestampStr.split(" ");
    if (parts.length !== 2) return new Date(0);
    const timeParts = parts[0].split(":");
    const dateParts = parts[1].split("-");
    if (timeParts.length !== 3 || dateParts.length !== 3) return new Date(0);
    return new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[0]),
        parseInt(timeParts[0]),
        parseInt(timeParts[1]),
        parseInt(timeParts[2])
    );
};

function Community() {
    const [messages, setMessages] = useState([])
    const onlineTotal = memberOnline.length;
    const [inputValue, setInputValue] = useState("");
    const [searchMember, setSearchMember] = useState("");
    const stompClientRef = useRef(null);
    const chatScrollAreaRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MessageApi.getAll();
                if (response?.data?.data) {
                    const sortedMessages = [...response.data.data].sort((a, b) => {
                        return parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp);
                    });
                    setMessages(sortedMessages);
                }
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
                    setMessages((prev) => [...(prev || []), newMessage]);
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
    }, []);

    useEffect(() => {
        if (chatScrollAreaRef.current) {
            chatScrollAreaRef.current.scrollTo({
                top: chatScrollAreaRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
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

    const filteredMembers = memberOnline.filter(member => 
        member.name.toLowerCase().includes(searchMember.toLowerCase()) || 
        member.classes.toLowerCase().includes(searchMember.toLowerCase())
    );

    return (
        <div className="community-chat-wrapper">
            <div className="community-chat-container">
                {/* Khu vực chính: Khung chat */}
                <div className="chat-area">
                    <div className="chat-header">
                        <div className="chat-title-info">
                            <span className="chat-title-text">Góc thông tin PTIT</span>
                            <span className="chat-subtitle-text">Kênh trao đổi học tập và kết nối sinh viên</span>
                        </div>
                    </div>
                    
                    <div className="chat-messages-container">
                        {isLoading ? (
                            <div className="chat-loading-spinner">
                                <Spin description="Đang tải tin nhắn..." size="large" />
                            </div>
                        ) : (
                            <div className="chat-messages-scroll-area" ref={chatScrollAreaRef}>
                                {messages?.map((item, index) => (
                                    <MessageContent
                                        key={index}
                                        avatar={item.avatar}
                                        name={item.fullName}
                                        message={item.content}
                                        timestamp={item.timestamp}
                                        check={item.userId == localStorage.getItem("userId")}
                                        userName={item.userName}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="chat-input-panel">
                        <button className="chat-attach-btn" title="Đính kèm tệp">
                            <PaperClipOutlined />
                        </button>
                        <Input 
                            onChange={(e) => setInputValue(e.target.value)} 
                            onKeyDown={handleKeydown} 
                            value={inputValue} 
                            placeholder="Nhập tin nhắn gửi tới cộng đồng..." 
                            className="chat-message-input"
                        />
                        <button 
                            onClick={sendMessage}
                            className="chat-send-btn"
                            title="Gửi tin nhắn"
                        >
                            <SendOutlined />
                        </button>
                    </div>
                </div>

                {/* Khu vực phụ: Danh sách thành viên online */}
                <div className="members-sidebar">
                    <div className="sidebar-header">
                        <span className="online-badge-dot pulse"></span>
                        <span className="online-count-text">{onlineTotal} thành viên online</span>
                    </div>
                    
                    <div className="search-member-box">
                        <Input 
                            placeholder="Tìm kiếm thành viên..." 
                            value={searchMember}
                            onChange={(e) => setSearchMember(e.target.value)}
                            className="search-member-input"
                        />
                    </div>

                    <div className="members-list-scroll">
                        {filteredMembers.map((item) => (
                            <div key={item.id} className="member-item-row">
                                <div className="member-avatar-wrapper">
                                    <img src={item.avatar} alt={item.name} className="member-avatar-img" />
                                    <span className="member-online-status pulse"></span>
                                </div>
                                <div className="member-details">
                                    <div className="member-name-text">{item.name}</div>
                                    <div className="member-class-text">{item.classes}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Community;