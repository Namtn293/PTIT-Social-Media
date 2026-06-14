import "./Community.css"
import { Input, Spin } from "antd"
import { useState, useEffect, useRef } from "react"
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons"
import MessageContent from "../../components/message/MessageContent"
import MessageApi from "../../api/MessageApi"
import userInfoApi from "../../api/UserInfoApi"
import { useWebSocket } from "../../context/WebSocketContext"

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
    const [members, setMembers] = useState([])
    const { stompClient, connected, onlineUsernames } = useWebSocket();
    const onlineTotal = members.filter(m => onlineUsernames.includes(m.userName)).length;
    const [inputValue, setInputValue] = useState("");
    const [searchMember, setSearchMember] = useState("");
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
        const fetchMembers = async () => {
            try {
                const response = await userInfoApi.getAllUserInfo();
                if (response?.data?.data) {
                    const mappedMembers = response.data.data.map(item => ({
                        id: item.userId,
                        userName: item.userName,
                        name: item.fullName || item.userName,
                        avatar: item.avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
                        classes: item.className || "Không có lớp"
                    }));
                    setMembers(mappedMembers);
                }
            } catch (err) {
                console.log("Lỗi load danh sách thành viên " + err);
            }
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        if (!stompClient || !connected) return;

        const subscription = stompClient.subscribe("/topic/public", (message) => {
            const newMessage = JSON.parse(message.body);
            if (newMessage.type === "EDIT") {
                setMessages((prev) =>
                    prev.map((msg) => (msg.id === newMessage.id ? { ...msg, content: newMessage.content, isEdited: newMessage.isEdited } : msg))
                );
            } else if (newMessage.type === "DELETE") {
                setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
            } else {
                setMessages((prev) => [...(prev || []), newMessage]);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [stompClient, connected]);

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
        if (!stompClient || !connected) return;
        const messageDTO = { userId: localStorage.getItem("userId"), content: inputValue };
        stompClient.publish({
            destination: "/app/chat-community",
            body: JSON.stringify(messageDTO),
        });
        setInputValue("");
    }

    const handleEditMessage = async (id, newContent) => {
        try {
            await MessageApi.edit(id, { content: newContent });
        } catch (err) {
            console.error("Lỗi khi sửa tin nhắn", err);
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            await MessageApi.delete(id);
        } catch (err) {
            console.error("Lỗi khi xóa tin nhắn", err);
        }
    };

    const handleKeydown = (e) => {
        if (e.key === "Enter") sendMessage();
    }

    const filteredMembers = members.filter(member =>
        (member.name?.toLowerCase() || "").includes(searchMember.toLowerCase()) ||
        (member.classes?.toLowerCase() || "").includes(searchMember.toLowerCase())
    );

    const sortedFilteredMembers = [...filteredMembers].sort((a, b) => {
        const aOnline = onlineUsernames.includes(a.userName);
        const bOnline = onlineUsernames.includes(b.userName);
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;
        return 0;
    });

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
                                        key={item.id || index}
                                        id={item.id}
                                        userId={item.userId}
                                        avatar={item.avatar}
                                        name={item.fullName}
                                        message={item.content}
                                        timestamp={item.timestamp}
                                        check={item.userId == localStorage.getItem("userId")}
                                        userName={item.userName}
                                        isEdited={item.isEdited}
                                        onEdit={handleEditMessage}
                                        onDelete={handleDeleteMessage}
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
                        <span className="online-count-text">{onlineTotal} đang hoạt động</span>
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
                        {sortedFilteredMembers.map((item) => (
                            <div key={item.id} className="member-item-row">
                                <div className="member-avatar-wrapper">
                                    <img src={item.avatar} alt={item.name} className="member-avatar-img" />
                                    {onlineUsernames.includes(item.userName) && (
                                        <span className="member-online-status pulse"></span>
                                    )}
                                </div>
                                <div className="member-details">
                                    <div className="member-name-text">{item.name}</div>
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