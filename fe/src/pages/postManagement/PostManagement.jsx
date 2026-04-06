import React, {useEffect, useState} from "react";
import { Button, Input, Table, Popconfirm } from "antd";
import postApi from "../../api/PostAPI";

function PostManagement(){
    const [searchText, setSearchText] = useState("");
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
            title: "Chủ đề",
            dataIndex: "subject",
            key: "subject"
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

    // useEffect(()=>{
    //     const token = localStorage.getItem("token");
    //     console.log("Token",token);
    // })

    const fetchPosts = async ()=>{
        try{
            const response = await postApi.getAll();

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
        const newPosts = posts.filter(posts=>posts.id!==id);
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
    "subject",
    "author"
    ];

    const filteredPosts = posts.filter((post) => {
        const keyword = removeVietnameseTones(searchText);

        return searchableColumns.some((column) =>
            removeVietnameseTones(post[column]).includes(keyword)
        );
    });

    return(
        <div className="post-manager-container" 
            style={{backgroundColor:"#c7c7c79f",
                height:"100vh",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"column",
                gap:"10px"
            }}>
            <div className="filter-container" style={{width:"100%"}}>
                <Input 
                    type="text" 
                    placeholder="Nhập từ khóa"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        width:"200px",
                        borderRadius:"5px",
                        outline:"none",
                        padding:"5px 10px",
                        border: "1px solid #ccc",
                        margin: "10px 0 0 65px"
                    }}
                />
            </div>
            
            <div className="list-pages-container"
                style={{
                    width: "90%",
                    height: "90%",
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