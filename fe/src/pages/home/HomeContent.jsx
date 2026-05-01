import "./HomeContent.css";
import { Button, Input, Select } from "antd";
import {SearchOutlined} from "@ant-design/icons"
import Title from "antd/es/skeleton/Title";
const { Option } = Select;
import PostApi from "../../api/PostApi"
import PostLayout from "../../components/post/PostLayout"
import Pagination from "../../components/pagination/Pagination"
import {useState,useEffect} from "react"
function HomeContent() {
    const [posts,setPosts]=useState([]);

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

    useEffect(()=>{
        const fetchData=async () =>{
            try{
                const response=await PostApi.getAllHomePosts();
                setPosts(response.data.data);
            } catch(err){
                console.log("Lỗi tải dữ liệu "+err);
            } finally{

            }
        }
        fetchData();
    },[])

    
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