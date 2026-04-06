import "./HomeContent.css";
import { Button, Input, Select } from "antd";
import {SearchOutlined} from "@ant-design/icons"
import Title from "antd/es/skeleton/Title";
const { Option } = Select;
import PostLayout from "../../components/post/PostLayout"
import Pagination from "../../components/pagination/Pagination"
import {useState} from "react"
function HomeContent() {
    const subject = [
        "CTDL&GT",
        "Xác suất",
    ];

    const [currentPage, setCurrentPage]=useState(1);
    const files = [
    {
      title: "Đề Thi Cấu Trúc Dữ Liệu",
      time: "Hôm qua",
      img: "https://cdn-icons-png.flaticon.com/512/337/337946.png",
    },
    {
      title: "Slide Hệ Điều Hành",
      time: "2 ngày trước",
      img: "https://tse2.mm.bing.net/th/id/OIP.l-Rlz3vyLzq0l_esDzHYFAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      title: "An toàn và bảo mật hệ thống",
      time: "1 ngày trước",
      img: "https://tse3.mm.bing.net/th/id/OIP.wlKNVS1qZldlUEviReHUsAHaHO?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      title: "Cơ sở dữ liệu",
      time: "6 ngày trước",
      img: "https://tse2.mm.bing.net/th/id/OIP.l-Rlz3vyLzq0l_esDzHYFAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      title: "Công nghệ phần mềm",
      time: "9 ngày trước",
      img: "https://tse3.mm.bing.net/th/id/OIP.wlKNVS1qZldlUEviReHUsAHaHO?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      title: "Slide Thực tập cơ sở",
      time: "12 ngày trước",
      img: "https://tse2.mm.bing.net/th/id/OIP.l-Rlz3vyLzq0l_esDzHYFAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
  ];

    const posts=[
    {
        "id": "1",
        "title": "Góc cứu trợ Giải tích 2",
        "name": "Nguyễn Văn An",
        "time": "5 phút trước",
        "classes": "D23CQCN01-B",
        "likes": 125,
        "comments": 48,
        "saves": 30,
        "report": 0,
        "userName":"admin",
        "content": "Có anh chị khóa trên nào còn bộ tài liệu ôn thi Giải tích 2 của thầy Tùng không ạ? Càng gần thi em càng thấy kiến thức bay màu dần đều, cứu em với! 😭"
    },
    {
        "id": "2",
        "title": "Review Căng tin A2",
        "name": "Trần Thị Lan",
        "time": "45 phút trước",
        "classes": "D22CQDT05-N",
        "likes": 89,
        "comments": 15,
        "saves": 5,
        "report": 2,
        "userName":"admin",
        "content": "Mọi người ơi, hôm nay căng tin A2 có món sườn xào chua ngọt đỉnh lắm nhé. Mỗi tội phải xếp hàng hơi lâu từ cổng đỏ vào, ai đi ăn thì tranh thủ đi sớm nha."
    },
    {
        "id": "3",
        "title": "Tìm đồ thất lạc",
        "name": "Lê Minh Đức",
        "time": "2 tiếng trước",
        "classes": "D21CQCN09-B",
        "likes": 42,
        "comments": 10,
        "saves": 2,
        "report": 0,
        "userName":"admin",
        "content": "Mình có đánh rơi một chiếc thẻ sinh viên tên Lê Minh Đức ở khu vực sân bóng lúc 5h chiều nay. Ai nhặt được cho mình xin lại với ạ, mình xin cảm ơn và hậu tạ một chầu trà sữa!"
    },
    {
        "id": "4",
        "title": "Kinh nghiệm thực tập",
        "name": "Hoàng Xuân Bách",
        "time": "5 tiếng trước",
        "classes": "D20CQVT01-B",
        "likes": 310,
        "comments": 85,
        "saves": 150,
        "report": 0,
        "userName":"admin",
        "content": "Chào các em khóa dưới, mình vừa hoàn thành kỳ thực tập tại Viettel. Có vài tips về việc chuẩn bị CV và ôn tập kiến thức nền tảng (OOP, SQL, Data Structure) muốn chia sẻ cho các bạn D22, D23 đang lo lắng. Ai quan tâm không?"
    },
    {
        "id": "5",
        "title": "CLB S-Media tuyển thành viên",
        "name": "S-Media PTIT",
        "time": "1 ngày trước",
        "classes": "CLB Truyền Thông",
        "likes": 520,
        "comments": 120,
        "saves": 45,
        "report": 0,
        "userName":"admin",
        "content": "🔥 [RECRUITMENT] Bạn đam mê nhiếp ảnh? Bạn thích viết lách hay edit video? Đừng bỏ lỡ cơ hội trở thành một mẩu của gia đình S-Media trong đợt tuyển thành viên lớn nhất năm nay nhé!"
    },
    {
        "id": "6",
        "title": "Thắc mắc đăng ký tín chỉ",
        "name": "Phạm Hải Yến",
        "time": "2 ngày trước",
        "classes": "D23CQMR02-B",
        "likes": 15,
        "comments": 60,
        "saves": 3,
        "report": 5,
        "userName":"admin",
        "content": "Web trường mình lại 'nghẻo' rồi hả mọi người? Em canh từ 12h đêm đến giờ vẫn chưa vào được để đăng ký môn học phần. Có ai bị giống em không?"
    }
    ];


    
    return (
        <div className="home-container">
            <div className="post-position" style={{marginBottom:"20px",flex:1}}>
                <div className="home-title">Chào mừng bạn đến với cộng đồng sinh viên PTIT!</div>
                <div className="search-position">
                    <Input size="large" style={{ width: "500px",borderRadius:"5px",fontSize:14,height:35}} placeholder="Tìm kiếm bài viết" />
                    
                    <Select size="large" placeholder="Môn học" className="subject-class" style={{borderRadius:"5px", fontSize:13}}>
                        {subject.map((item, index) => (
                            <Option key={index}>{item}</Option>
                        ))}
                    </Select>
                    
                    <Button icon={<SearchOutlined/>} size="large" type="primary" className="search-button" style={{height:35,borderRadius:"5px" }}>
                        Tìm kiếm
                    </Button>
                </div>
                <div className="search-post">
                    {posts.map((post)=>{
                        return <PostLayout key={post.id} {...post}/>
                    })}   
                    <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage}></Pagination>
                    <div style={{height:"20px"}}></div>                
                </div>
            </div>

            <div className="document-position" style={{width:"25%"}}>
                <div className="port-title" style={{paddingBottom:"5px",borderBottom:"1px solid #e1e1e1",marginTop:"3px",textAlign:"center",fontSize:20,fontWeight:700,color:"rgb(33, 33, 33)"}}>Tài liệu mới</div>   
                <div className="file-container1" style={{padding:"10px"}}>
                    {files.map((file,index)=>{
                        return (<div className="file-container2" key={index}>
                            <img src={file.img} />
                            <div>
                                <p>{file.title}</p>
                                <span>{file.time}</span>
                            </div>
                        </div>
                    )})}
                </div>
            </div>


        </div>
    );
}

export default HomeContent;