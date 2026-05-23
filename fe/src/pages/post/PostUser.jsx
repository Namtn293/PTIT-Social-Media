import { Button, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PostLayout from "../../components/post/PostLayout";
import Pagination from "../../components/pagination/Pagination";
import { useState } from "react";
import PostDetail from "../../components/post/PostDetail";

const { Option } = Select;

function PostUser() {
    const [open, setOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleOpenPost = (post) => {
        setSelectedPost(post);
        setOpen(true);
    };

    const subject = [
        "CTDL&GT",
        "Xác suất",
    ];

    const posts = [
        {
            id: "1",
            title: "Góc cứu trợ Giải tích 2",
            name: "Nguyễn Văn An",
            time: new Date("2026-05-20T09:30:00"), // Đăng cách đây vài ngày
            classes: "D23CQCN01-B",
            likes: 125,
            comments: 48,
            saves: 30,
            report: 0,
            userName: "admin",
            content: "Có anh chị khóa trên nào còn bộ tài liệu ôn thi Giải tích 2 của thầy Tùng không ạ? Càng gần thi em càng thấy kiến thức bay màu dần đều, cứu em với! 😭",
        },
        {
            id: "2",
            title: "Review Căng tin A2",
            name: "Trần Thị Lan",
            time: new Date("2026-05-18T11:45:00"), // Đăng cách đây gần 1 tuần
            classes: "D22CQDT05-N",
            likes: 89,
            comments: 15,
            saves: 5,
            report: 2,
            userName: "admin",
            content: "Mọi người ơi, hôm nay căng tin A2 có món sườn xào chua ngọt đỉnh lắm nhé. Mỗi tội phải xếp hàng hơi lâu từ cổng đỏ vào, ai đi ăn thì tranh thủ đi sớm nha.",
        },
        {
            id: "3",
            title: "Tìm đồ thất lạc",
            name: "Lê Minh Đức",
            time: new Date("2026-05-15T16:20:00"),
            classes: "D21CQCN09-B",
            likes: 42,
            comments: 10,
            saves: 2,
            report: 0,
            userName: "admin",
            content: "Mình có đánh rơi một chiếc thẻ sinh viên tên Lê Minh Đức ở khu vực sân bóng lúc 5h chiều nay. Ai nhặt được cho mình xin lại với ạ, mình xin cảm ơn và hậu tạ một chầu trà sữa!",
        },
        {
            id: "4",
            title: "Kinh nghiệm thực tập",
            name: "Hoàng Xuân Bách",
            time: new Date("2026-05-10T14:00:00"), // Đăng cách đây khoảng 2 tuần
            classes: "D20CQVT01-B",
            likes: 310,
            comments: 85,
            saves: 150,
            report: 0,
            userName: "admin",
            content: "Chào các em khóa dưới, mình vừa hoàn thành kỳ thực tập tại Viettel. Có vài tips về việc chuẩn bị CV và ôn tập kiến thức nền tảng (OOP, SQL, Data Structure) muốn chia sẻ cho các bạn D22, D23 đang lo lắng. Ai quan tâm không?",
        },
        {
            id: "5",
            title: "CLB S-Media tuyển thành viên",
            name: "S-Media PTIT",
            time: new Date("2026-05-01T08:00:00"), // Đăng từ đầu tháng
            classes: "CLB Truyền Thông",
            likes: 520,
            comments: 120,
            saves: 45,
            report: 0,
            userName: "admin",
            content: "🔥 [RECRUITMENT] Bạn đam mê nhiếp ảnh? Bạn thích viết lách hay edit video? Đừng bỏ lỡ cơ hội trở thành một mẩu của gia đình S-Media trong đợt tuyển thành viên lớn nhất năm nay nhé!",
        },
        {
            id: "6",
            title: "Thắc mắc đăng ký tín chỉ",
            name: "Phạm Hải Yến",
            time: new Date("2026-04-25T00:05:00"), // Đăng từ tháng trước
            classes: "D23CQMR02-B",
            likes: 15,
            comments: 60,
            saves: 3,
            report: 5,
            userName: "admin",
            content: "Web trường mình lại 'nghẻo' rồi hả mọi người? Em canh từ 12h đêm đến giờ vẫn chưa vào được để đăng ký môn học phần. Có ai bị giống em không?",
        },
    ];

    const comments = [
        // Comments cho Post 1 (Giải tích 2)
        { id: 1, postId: "1", userId: 101, name: "Trần Thế Vinh", avatar: "https://i.pravatar.cc/150?img=11", content: "Thầy Tùng chấm gắt lắm á, học kỹ bài tập bồi dưỡng nha khứa.", createdAt: new Date("2026-05-20T10:00:00") },
        { id: 2, postId: "1", userId: 102, name: "Lê Thu Thảo", avatar: "https://i.pravatar.cc/150?img=12", content: "Chấm hóng ké, mình cũng đang lú phần tích phân mặt.", createdAt: new Date("2026-05-20T10:15:00") },
        { id: 3, postId: "1", userId: 103, name: "Phạm Minh Hoàng", avatar: "https://i.pravatar.cc/150?img=13", content: "Check inbox đi em, anh gửi link drive slide với đề cựu sinh viên cho.", createdAt: new Date("2026-05-20T11:02:00") },
        { id: 4, postId: "1", userId: 104, name: "Vũ Hải Đăng", avatar: "https://i.pravatar.cc/150?img=14", content: "Cứ làm hết bài tập trong cuốn bài tập toán cao cấp tập 3 là qua môn nhé.", createdAt: new Date("2026-05-20T13:40:00") },
        { id: 5, postId: "1", userId: 105, name: "Đặng Mỹ Linh", avatar: "https://i.pravatar.cc/150?img=15", content: "Cảm ơn anh Hoàng đẹp trai, em cũng vừa vô tình thấy ké được link hihi.", createdAt: new Date("2026-05-20T14:10:00") },

        // Comments cho Post 2 (Căng tin A2)
        { id: 6, postId: "2", userId: 106, name: "Nguyễn Hoàng Nam", avatar: "https://i.pravatar.cc/150?img=16", content: "Sườn ngon thật nhưng công nhận xếp hàng cực hình ghê.", createdAt: new Date("2026-05-18T12:00:00") },
        { id: 7, postId: "2", userId: 107, name: "Bùi Bích Phương", avatar: "https://i.pravatar.cc/150?img=17", content: "Hôm nay hết sớm lắm luôn, tầm 12h15 xuống là không còn một cọng sườn.", createdAt: new Date("2026-05-18T12:20:00") },
        { id: 8, postId: "2", userId: 108, name: "Vương Đình Nguyên", avatar: "https://i.pravatar.cc/150?img=18", content: "Căng tin nay đổi đầu bếp hay sao ấy, ăn cuốn hẳn.", createdAt: new Date("2026-05-18T12:45:00") },
        { id: 9, postId: "2", userId: 109, name: "Đỗ Gia Bảo", avatar: "https://i.pravatar.cc/150?img=19", content: "Ngon bằng thịt kho tàu bên nhà ăn B2 không mọi người?", createdAt: new Date("2026-05-18T13:01:00") },
        { id: 10, postId: "2", userId: 110, name: "Mai Thu Trang", avatar: "https://i.pravatar.cc/150?img=20", content: "@Đỗ Gia Bảo ăn đứt luôn nha bạn ơi, sườn đỉnh hơn.", createdAt: new Date("2026-05-18T13:15:00") },

        // Comments cho Post 3 (Tìm đồ thất lạc)
        { id: 11, postId: "3", userId: 111, name: "Cao Tiến Đạt", avatar: "https://i.pravatar.cc/150?img=21", content: "Lúc nãy thấy có bạn cầm lên văn phòng Đoàn chỗ hội trường kìa, qua hỏi thử xem.", createdAt: new Date("2026-05-15T17:10:00") },
        { id: 12, postId: "3", userId: 112, name: "Phùng Yến Nhi", avatar: "https://i.pravatar.cc/150?img=22", content: "Mong bạn sớm tìm lại được thẻ nha, mất làm lại lâu lắm.", createdAt: new Date("2026-05-15T17:30:00") },
        { id: 13, postId: "3", userId: 113, name: "Dương Quốc Anh", avatar: "https://i.pravatar.cc/150?img=23", content: "Trà sữa full topping không thớt ơi để mình đi tìm phụ haha.", createdAt: new Date("2026-05-15T18:00:00") },
        { id: 14, postId: "3", userId: 114, name: "Nguyễn Khánh Huyền", avatar: "https://i.pravatar.cc/150?img=24", content: "Up bài cho đỡ trôi. Chúc may mắn nha.", createdAt: new Date("2026-05-15T19:25:00") },
        { id: 15, postId: "3", userId: 115, name: "Lê Minh Đức", avatar: "https://i.pravatar.cc/150?img=25", content: "@Cao Tiến Đạt ôi cảm ơn bác nhiều nha, mai mình lên check liền.", createdAt: new Date("2026-05-15T20:10:00") },

        // Comments cho Post 4 (Kinh nghiệm thực tập)
        { id: 16, postId: "4", userId: 116, name: "Tạ Minh Tuấn", avatar: "https://i.pravatar.cc/150?img=26", content: "Anh ơi em xin slot tư vấn CV với ạ, em chuẩn bị đi thực tập đợt hè.", createdAt: new Date("2026-05-10T14:30:00") },
        { id: 17, postId: "4", userId: 117, name: "Đinh Kiều Anh", avatar: "https://i.pravatar.cc/150?img=27", content: "Bài viết ý nghĩa quá, đúng thứ lứa D22 đang cần mòn mỏi.", createdAt: new Date("2026-05-10T15:15:00") },
        { id: 18, postId: "4", userId: 118, name: "Hoàng Xuân Bách", avatar: "https://i.pravatar.cc/150?img=28", content: "Mấy bạn cần cứ chấm ở đây tối mình gom nhóm rồi gửi tài liệu một thể nhé.", createdAt: new Date("2026-05-10T16:00:00") },
        { id: 19, postId: "4", userId: 119, name: "Nguyễn Tuấn Tú", avatar: "https://i.pravatar.cc/150?img=29", content: "Cho em một chấm hóng tài liệu OOP với SQL với ạ.", createdAt: new Date("2026-05-10T16:45:00") },
        { id: 20, postId: "4", userId: 120, name: "Chu Ngọc Hà", avatar: "https://i.pravatar.cc/150?img=30", content: "Viettel có test đầu vào LeetCode nhiều không anh?", createdAt: new Date("2026-05-10T17:20:00") },

        // Comments cho Post 5 (CLB Tuyển thành viên)
        { id: 21, postId: "5", userId: 121, name: "Hà Duy Kiên", avatar: "https://i.pravatar.cc/150?img=31", content: "S-Media năm ngoái trượt form, năm nay quyết tâm phục thù!", createdAt: new Date("2026-05-01T09:15:00") },
        { id: 22, postId: "5", userId: 122, name: "Lý Thị Huệ", avatar: "https://i.pravatar.cc/150?img=32", content: "CLB này xịn lắm nha, nhiều gái xinh nữa chứ lị.", createdAt: new Date("2026-05-01T10:00:00") },
        { id: 23, postId: "5", userId: 123, name: "Nghiêm Xuân Trường", avatar: "https://i.pravatar.cc/150?img=33", content: "Có giới hạn số lượng thành viên tuyển cho ban kỹ thuật không ạ?", createdAt: new Date("2026-05-01T11:30:00") },
        { id: 24, postId: "5", userId: 124, name: "Trịnh Thùy Chi", avatar: "https://i.pravatar.cc/150?img=34", content: "@Nghiêm Xuân Trường thoải mái đi bạn ơi, năng lực ok là duyệt hết.", createdAt: new Date("2026-05-01T13:10:00") },
        { id: 25, postId: "5", userId: 125, name: "Đoàn Văn Hậu", avatar: "https://i.pravatar.cc/150?img=35", content: "Đã nộp form, hy vọng qua được vòng gửi xe 😭.", createdAt: new Date("2026-05-01T15:40:00") },

        // Comments cho Post 6 (Đăng ký tín chỉ)
        { id: 26, postId: "6", userId: 126, name: "Lâm Hoài Bảo", avatar: "https://i.pravatar.cc/150?img=36", content: "Tính năng truyền thống của web trường rồi, không sập không phải PTIT.", createdAt: new Date("2026-04-25T00:30:00") },
        { id: 27, postId: "6", userId: 127, name: "Trần Tố Uyên", avatar: "https://i.pravatar.cc/150?img=37", content: "Em F5 đến xước luôn cái màn hình máy tính rồi vẫn Gateway Timeout.", createdAt: new Date("2026-04-25T00:55:00") },
        { id: 28, postId: "6", userId: 128, name: "Phan Văn Đức", avatar: "https://i.pravatar.cc/150?img=38", content: "Kinh nghiệm là ngủ đi tầm 4h sáng dậy đăng ký vèo vèo nhé.", createdAt: new Date("2026-04-25T01:15:00") },
        { id: 29, postId: "6", userId: 129, name: "Nguyễn Thị Thơ", avatar: "https://i.pravatar.cc/150?img=39", content: "@Phan Văn Đức 4h sáng dậy còn đúng cái nịt luôn ông ơi, mất hết lớp đẹp.", createdAt: new Date("2026-04-25T01:45:00") },
        { id: 30, postId: "6", userId: 130, name: "Đặng Hoàng Long", avatar: "https://i.pravatar.cc/150?img=40", content: "Thôi chấp nhận học kỳ này học muộn vậy, bất lực thật sự.", createdAt: new Date("2026-04-25T02:20:00") },
    ];

    return (
        <div className="home-container">
            <div className="post-position" style={{ marginBottom: "20px", flex: 1, padding: "0 10%" }}>
                <div className="search-position">
                    <Input size="large" style={{ width: "500px", borderRadius: "5px", fontSize: 14, height: 35 }} placeholder="Tìm kiếm bài viết" />
                    
                    <Select size="large" placeholder="Môn học" className="subject-class" style={{ borderRadius: "5px", fontSize: 13 }}>
                        {subject.map((item, index) => (
                            <Option key={index}>{item}</Option>
                        ))}
                    </Select>
                    
                    <Button icon={<SearchOutlined />} size="large" type="primary" className="search-button" style={{ height: 35, borderRadius: "5px" }}>
                        Tìm kiếm
                    </Button>
                </div>
                <div className="search-post">
                    {posts.map((post) => {
                        return (
                            <div
                                key={post.id}
                                onClick={() => handleOpenPost(post)}
                                style={{ cursor: "pointer" }}
                            >
                                <PostLayout {...post} />
                            </div>
                        );
                    })}   
                    <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage}></Pagination>
                    <PostDetail
                        open={open}
                        onClose={() => setOpen(false)}
                        post={selectedPost}
                        comments={comments}
                    />
                    <div style={{ height: "20px" }}></div>                
                </div>
            </div>
        </div>
    );
}

export default PostUser;