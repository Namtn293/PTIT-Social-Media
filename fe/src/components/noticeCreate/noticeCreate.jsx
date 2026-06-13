import { CloseOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Button, Input, Select, message } from "antd";
import { useState, useEffect } from "react";
import userInfoApi from "../../api/UserInfoApi";

const { TextArea } = Input;

const NoticeCreate = ({ onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [recipients, setRecipients] = useState(["-1"]); // Default is "All" (-1)
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const res = await userInfoApi.getAllUserInfo();
                if (res?.data?.data) {
                    setUsers(res.data.data);
                }
            } catch (err) {
                console.error("Lỗi lấy danh sách người dùng:", err);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    const handleAddRecipient = () => {
        setRecipients([...recipients, ""]);
    };

    const handleRemoveRecipient = (index) => {
        if (recipients.length === 1) return;
        const newRecipients = recipients.filter((_, i) => i !== index);
        setRecipients(newRecipients);
    };

    const handleRecipientChange = (value, index) => {
        let newRecipients = [...recipients];
        newRecipients[index] = value;
        if (value === "-1") {
            newRecipients = ["-1"];
        }
        setRecipients(newRecipients);
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            message.error("Vui lòng nhập nội dung thông báo!");
            return;
        }

        // Filter out empty selection
        const activeRecipients = recipients.filter(r => r !== "");
        if (activeRecipients.length === 0) {
            message.error("Vui lòng chọn ít nhất một người nhận!");
            return;
        }

        try {
            // Loop through each active recipient and call onSubmit
            for (const recipient of activeRecipients) {
                const data = {
                    title: title.trim(),
                    content: content.trim(),
                    userName: recipient, // Selected userName (or "-1" for All)
                    createAt: new Date().toISOString()
                };
                if (onSubmit) {
                    await onSubmit(data);
                }
            }
            message.success("Gửi thông báo thành công!");
            onClose();
        } catch (err) {
            console.error("Lỗi khi gửi thông báo:", err);
            message.error("Không thể gửi thông báo, vui lòng thử lại!");
        }
    };

    const selectOptions = [
        { value: "-1", label: "Tất cả (All)" },
        ...users.map(user => ({
            value: user.userName,
            label: user.userName
        }))
    ];

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(4px)"
        }}>
            <div style={{
                width: "550px",
                maxHeight: "90vh",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "1px solid #f0f0f0"
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 24px",
                    borderBottom: "1px solid #f0f0f0"
                }}>
                    <span style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#1f1f1f"
                    }}>Tạo thông báo mới</span>
                    <Button 
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={onClose}
                        style={{
                            color: "#8c8c8c",
                            borderRadius: "50%"
                        }}
                    />
                </div>

                {/* Body Content */}
                <div style={{
                    padding: "24px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}>
                    {/* Tiêu đề */}
                    <div>
                        <div style={{ fontWeight: 500, marginBottom: "8px", color: "#262626" }}>Tiêu đề</div>
                        <Input 
                            placeholder="Nhập tiêu đề thông báo"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ borderRadius: "8px", height: "40px" }}
                        />
                    </div>

                    {/* Nội dung */}
                    <div>
                        <div style={{ fontWeight: 500, marginBottom: "8px", color: "#262626" }}>Nội dung</div>
                        <TextArea 
                            placeholder="Nhập nội dung chi tiết thông báo..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            style={{ borderRadius: "8px" }}
                        />
                    </div>

                    {/* Người nhận */}
                    <div>
                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            marginBottom: "12px"
                        }}>
                            <span style={{ fontWeight: 500, color: "#262626" }}>Người nhận</span>
                            <Button 
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={handleAddRecipient}
                                disabled={recipients.includes("-1")}
                                style={{
                                    borderRadius: "6px",
                                    borderColor: recipients.includes("-1") ? "#d9d9d9" : "#1890ff",
                                    color: recipients.includes("-1") ? "rgba(0, 0, 0, 0.25)" : "#1890ff"
                                }}
                            >
                                Thêm người nhận
                            </Button>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            maxHeight: "180px",
                            overflowY: "auto",
                            paddingRight: "5px"
                        }} className="scrollbar-custom">
                            {recipients.map((recipient, index) => (
                                <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <Select
                                        showSearch
                                        placeholder="Chọn người nhận để gửi"
                                        optionFilterProp="label"
                                        value={recipient || undefined}
                                        onChange={(value) => handleRecipientChange(value, index)}
                                        style={{ flex: 1, height: "40px" }}
                                        dropdownStyle={{ borderRadius: "8px" }}
                                        options={selectOptions}
                                        loading={loadingUsers}
                                    />
                                    {recipients.length > 1 && (
                                        <Button 
                                            danger 
                                            type="text"
                                            icon={<MinusOutlined />} 
                                            onClick={() => handleRemoveRecipient(index)}
                                            style={{
                                                height: "40px",
                                                width: "40px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "8px"
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    padding: "16px 24px",
                    borderTop: "1px solid #f0f0f0",
                    backgroundColor: "#fafafa"
                }}>
                    <Button 
                        onClick={onClose}
                        style={{ borderRadius: "8px", height: "38px" }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button 
                        type="primary"
                        onClick={handleSubmit}
                        disabled={!content.trim()}
                        style={{ 
                            borderRadius: "8px", 
                            height: "38px",
                            backgroundColor: "#1890ff",
                            borderColor: "#1890ff"
                        }}
                    >
                        Gửi thông báo
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NoticeCreate;