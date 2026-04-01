import "./HomeContent.css";
import { Button, Input, Select } from "antd";
import {SearchOutlined} from "@ant-design/icons"
import Title from "antd/es/skeleton/Title";
const { Option } = Select;
import PostLayout from "../../components/post/PostLayout"


function HomeContent() {
    const subject = [
        "CTDL&GT",
        "Xác suất",
    ];

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
        id:"1",
        title:"Hỏi đáp thắc mắc",
        name:"Nam Trần",
        time:"1 phút trước",
        classes:"B23CQCN04-B",
        likes:10,
        comments:10,
        saves:10,
        report:10,
        content:"P - SERIES FOR 2K8- D26] : TING! TING! THÔNG BÁO CHÍNH THỨC MỞ ĐƠN ĐĂNG KÝ THAM GIA OPEN DAY PTIT 2026. Những hành khách 2K8 thân mến, chuyến bay mang số hiệu OPEN DAY PTIT 2026 – Flight To Innovation đã chính thức mở cổng check-in! Bạn đã sẵn sàng để trở thành người cầm lái chinh phục đường bay của chính mình chưa? "
    },
    {
        id:"2",
        title:"Đăng kí tín chỉ",
        name:"Nam Trần",
        time:"10 phút trước",
        classes:"B23CQCN04-B",
        likes:10,
        comments:10,
        saves:10,
        report:10,
        content:"P - SERIES FOR 2K8- D26] : TING! TING! THÔNG BÁO CHÍNH THỨC MỞ ĐƠN ĐĂNG KÝ THAM GIA OPEN DAY PTIT 2026. Những hành khách 2K8 thân mến, chuyến bay mang số hiệu OPEN DAY PTIT 2026 – Flight To Innovation đã chính thức mở cổng check-in! Bạn đã sẵn sàng để trở thành người cầm lái chinh phục đường bay của chính mình chưa? "
    },
    {
        id:"3",
        title:"Đồng phục",
        name:"Nam Trần",
        time:"1 tiếng trước",
        classes:"B23CQCN04-B",
        likes:10,
        comments:10,
        saves:10,
        report:10,
        content:"Mọi người ơi trường mình bao giờ phát đồng phục vậy ạ "
    },{
        id:"4",
        title:"Đồng phục",
        name:"Nam Trần",
        time:"1 tiếng trước",
        classes:"B23CQCN04-B",
        likes:10,
        comments:10,
        saves:10,
        report:10,
        content:"Mọi người ơi trường mình bao giờ phát đồng phục vậy ạ "
    },
    ]
    return (
        <div className="home-container">
            <div className="post-position" style={{marginBottom:"20px"}}>
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
                    <div style={{height:"20px"}}></div>                
                </div>
            </div>

            <div className="document-position">
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