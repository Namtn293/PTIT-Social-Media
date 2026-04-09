import React, {useEffect, useState} from "react";
import { Button, Input, Table, Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import postApi from "../../api/PostAPI";

function PostManagement(){
    const [searchText, setSearchText] = useState("");
    const [filterKeyWord, setFilterKeyWord] = useState("");
    const [posts, setPosts] = useState([]);
    const columns = [
        {
            title: "STT",
            dataIndex: "idx",
            key: "idx",
            width: 70
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content"
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            key: "author"
        },
        {
            title: "Ngày tạo",
            dataIndex: "createAt",
            key: "createAt",
            render: (date)=>{
                return new Date(date).toLocaleString("vi-VN",{
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })
            }
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            render: (_,record)=>{
                return (
                    <Popconfirm
                        title="Bạn có chắc muốn xóa không?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button 
                            style={{backgroundColor:"#ff4d4f",color:"white"}}
                        >Xóa</Button>
                    </Popconfirm>
                    
                )
            }
        },
    ];

    useEffect(()=>{
        fetchPosts();
    },[]);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        console.log("Token",token);
    })

    const fetchPosts = async ()=>{
        try{
            const response = await postApi.getAllAdminPost();

            const postsWithIndex = response.data.data.map((post,index)=>({
                ...post,
                idx: index + 1
            }))

            setPosts(postsWithIndex);
        }catch(error){
            console.error("Lỗi gọi API:", error);
        }
    }

    const handleDelete = (id)=>{
        const newPosts = posts.filter(post=>post.id!==id);
        setPosts(newPosts);
    }

    function removeVietnameseTones(str) {
    return str
        ?.normalize("NFD")
        ?.replace(/[\u0300-\u036f]/g, "")
        ?.replace(/đ/g, "d")
        ?.replace(/Đ/g, "D")
        ?.toLowerCase()
        ?.trim();
    }

    const searchableColumns = [
    "title",
    "content",
    "author"
    ];

    const filteredPosts = posts.filter((post) => {
        const keyword = removeVietnameseTones(searchText);

        return searchableColumns.some((column) =>
            removeVietnameseTones(post[column] || "").includes(keyword)
        );
    });

    return(
        <div className="post-manager-container" 
            style={{backgroundColor:"#f4f4fc",
                height:"100vh",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"column",
                gap:"10px",
                padding:"30px"
            }}>
            <div className="filter-container" style={{width:"100%",display:"flex"}}>
                <Input 
                    type="text" 
                    placeholder="Nhập từ khóa"
                    value={filterKeyWord}
                    onChange={(e)=> setFilterKeyWord(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setSearchText(filterKeyWord)}
                    style={{
                        width:"500px",
                        borderRadius:"5px",
                        outline:"none",
                        padding:"5px 10px",
                        border: "1px solid #ccc",
                    }}
                />
                <Button icon={<SearchOutlined/>} 
                    size="large" 
                    type="primary" 
                    onClick={()=>setSearchText(filterKeyWord)}
                    style={{
                        height:35,
                        borderRadius:"5px", 
                        marginLeft:10,
                    }}>
                    Tìm kiếm
                </Button>
            </div>
            
            <div className="list-pages-container"
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor:"#ffffff",
                    borderRadius:"10px",
                    marginBottom:"10px"
                }}>

                <Table columns={columns}
                dataSource={filteredPosts}
                rowKey="id"
                pagination={{
                    pageSize:7,
                    position:["bottomCenter"],
                    showLessItems: true,
                    showSizeChanger: false
                }}
                >

                </Table>

            </div>
        </div>
    )
}
export default PostManagement;