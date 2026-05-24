import { useState, useEffect, useRef } from "react";
import { Modal, Button, Input, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import commentApi from "../../api/CommentApi";
import "./CommentDialog.css";

const CommentDialog = ({ visible, onClose, postId, postTitle }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ref để scroll xuống cuối
  const commentsEndRef = useRef(null);

  // Hàm scroll xuống cuối
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Hàm gọi API lấy danh sách bình luận
  const fetchComments = async () => {
    if (!postId) return;

    try {
      setLoading(true);

      const response = await commentApi.getAllComment(postId);

      const commentData = response.data.data
        ? response.data.data
        : response;

      console.log(response.data);

      setComments(commentData || []);
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
      message.error("Không thể tải danh sách bình luận.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi mở modal hoặc đổi post
  useEffect(() => {
    if (visible) {
      fetchComments();
    } else {
      setComments([]);
    }
  }, [visible, postId]);

  // Tự động scroll xuống cuối khi comments thay đổi
  useEffect(() => {
    if (comments.length > 0) {
      scrollToBottom();
    }
  }, [comments]);

  // Hàm gửi bình luận
    const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    const userId = localStorage.getItem("userInfoId");

    if (!userId) {
        message.warning("Vui lòng đăng nhập để bình luận!");
        return;
    }

    setSubmitting(true);

    try {
        const payload = {
        postId: postId,
        userId: parseInt(userId, 10),
        content: commentText,
        };

        // Gửi API
        await commentApi.createNewComment(payload);
        // Tạo comment mới ở frontend
        const newComment = {
        content: commentText,
        fullName: localStorage.getItem("fullName"),
        avatar: localStorage.getItem("avatar"),
        timeUnit: new Date().toISOString(),
        };
                // Thêm vào cuối danh sách
        setComments((prev) => [...prev, newComment]);

        // Xóa input
        setCommentText("");

    } catch (error) {
        console.error(error.response?.data || error);
        message.error("Gửi bình luận thất bại!");
    } finally {
        setSubmitting(false);
    }
    };

  // Format thời gian
  const formatTime = (timeString) => {
    if (!timeString) return "";

    const date = new Date(timeString);

    return date.toLocaleString("vi-VN");
  };

  return (
    <Modal
      title={postTitle}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      className="comment-modal"
      styles={{
        body: {
          maxHeight: "600px",
          overflowY: "auto",
          padding: "16px",
        },
      }}
    >
      <div className="comments-list">
        {loading ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            Đang tải bình luận...
          </p>
        ) : comments.length > 0 ? (
          <>
            {comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <img
                  src={
                    comment.avatar ||
                    "https://th.bing.com/th/id/OIP.HAV08yo3UOY-ot3zO_bwewAAAA?w=165&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3"
                  }
                  alt={comment.fullName}
                  className="comment-avatar"
                />

                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.fullName}
                    </span>

                    <span className="comment-time">
                      {formatTime(comment.timeUnit)}
                    </span>
                  </div>

                  <p className="comment-text">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Điểm cuối để scroll */}
            <div ref={commentsEndRef} />
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>

      <div className="comment-input-section">
        <Input
          placeholder="Viết bình luận..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onPressEnter={handleSubmitComment}
          disabled={submitting}
          style={{
            borderRadius: "20px",
            paddingRight: "44px",
          }}
        />

        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={handleSubmitComment}
          loading={submitting}
          disabled={!commentText.trim() || submitting}
          className="send-button"
        />
      </div>
    </Modal>
  );
};

export default CommentDialog;