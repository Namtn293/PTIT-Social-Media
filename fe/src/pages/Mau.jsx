import PostLayout from "../components/post/PostLayout"
function Mau() {
    return (
    <PostLayout 
        key={3}
        name="Nguyễn Văn A"
        title="Chia sẻ kinh nghiệm học tập"
        content="Đây là nội dung bài viết test. Các bạn có thể xem component PostLayout hoạt động."
        avatar="https://tse3.mm.bing.net/th/id/OIP.aCwqDO1MIaS3qzA7DyFPdAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
        time={new Date().toISOString()}
        userName="nguyenvana"
        likes={42}
        comments={12}
        saves={5}
        report={0}
    />
)
}
export default Mau;
