import { Modal, Avatar, Input } from "antd";


function PostDetail({ open, onClose, post, comments }) {
    if (!post) return null;

    // Lọc comment theo bài viết
    const postComments = comments.filter(
        (item) => item.postId == post.id
    );

    const formatTimeAgo = (time) => {
    const now = new Date();
    const diffMs = now - new Date(time);

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
        return "Vừa xong";
    }

    if (minutes < 60) {
        return `${minutes} phút trước`;
    }

    if (hours < 24) {
        return `${hours} giờ trước`;
    }

    return `${days} ngày trước`;
};

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
            maskClosable={true}
            styles={{
                body: {
                    padding: 0,
                    height: "80vh",
                    overflow: "hidden",
                },
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "80vh",
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        padding: "16px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "bold",
                        fontSize: "24px",
                    }}
                >
                    {post.title}
                </div>

                {/* CONTENT */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "20px",
                    }}
                >
                    {/* USER */}
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <Avatar
                            size={50}
                            src={post.avatar}
                        />

                        <div>
                            <div style={{ fontWeight: "bold" }}>
                                {post.name}
                            </div>

                            <div style={{ color: "gray" }}>
                                {formatTimeAgo(post.time)}
                            </div>
                        </div>
                    </div>

                    {/* POST CONTENT */}
                    <div
                        style={{
                            fontSize: "18px",
                            lineHeight: "1.8",
                        }}
                    >
                        {post.content}
                    </div>

                    {/* IMAGE */}
                    {post.img != null && (
                        <img
                            src={post.img}
                            alt="post"
                            style={{
                                width: "100%",
                                marginTop: "20px",
                                borderRadius: "10px",
                            }}
                        />
                    )}

                    <div
                        style={{
                            height: "30px",
                            borderBottom: "1px #999 solid",
                        }}
                    ></div>

                    {/* COMMENTS */}
                    <div style={{ marginTop: "30px" }}>
                        {postComments.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginBottom: "20px",
                                    alignItems: "flex-start",
                                }}
                            >
                                {/* Avatar */}
                                <Avatar
                                    size={40}
                                    src={item.avatar}
                                />

                                {/* Comment box */}
                                <div
                                    style={{
                                        background: "#f5f5f5",
                                        padding: "10px 14px",
                                        borderRadius: "14px",
                                        maxWidth: "70%",
                                        width: "fit-content",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {item.name}
                                    </div>

                                    <div
                                        style={{
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {item.content}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "gray",
                                            marginTop: "5px",
                                        }}
                                    >
                                        {formatTimeAgo(item.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COMMENT INPUT */}
                <div
                    style={{
                        borderTop: "1px solid #ddd",
                        padding: "15px",
                        background: "white",
                    }}
                >
                    <Input
                        size="large"
                        placeholder="Viết bình luận công khai..."
                        style={{
                            borderRadius: "20px",
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default PostDetail;