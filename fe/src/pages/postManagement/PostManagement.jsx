import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { Button, Input, Table, Popconfirm } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import postApi from "../../api/PostAPI";
import "../admin-common.css";
import "./PostManagement.css";

function PostManagement(){
    const location = useLocation();
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
            dataIndex: "createdAt",
            key: "createdAt",
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
                            danger 
                            icon={<DeleteOutlined />} 
                        />
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

    useEffect(() => {
        if (location.state && location.state.searchTitle) {
            setFilterKeyWord(location.state.searchTitle);
            setSearchText(location.state.searchTitle);
        }
    }, [location.state]);

    const fetchPosts = async ()=>{
        try{
            const response = await postApi.getAllAdminPost();

            const postsWithIndex = response.data.data.map((post,index)=>({
                ...post,
                idx: index + 1
            }))

            console.log(postsWithIndex);

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

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <div className="admin-search-wrap">
                    <Input 
                        type="text" 
                        placeholder="Tìm kiếm bài viết..."
                        value={filterKeyWord}
                        onChange={(e) => setFilterKeyWord(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setSearchText(filterKeyWord)}
                        style={{ width: "400px" }}
                        size="large"
                    />
                    <Button 
                        icon={<SearchOutlined />} 
                        size="large" 
                        type="primary" 
                        onClick={() => setSearchText(filterKeyWord)}
                    >
                        Tìm kiếm
                    </Button>
                </div>
            </div>
            
            <div className="admin-page-card">
                <Table 
                    columns={columns}
                    dataSource={filteredPosts}
                    rowKey="id"
                    scroll={{ x: "max-content" }} 
                    pagination={{
                        pageSize: 7,
                        position: ["bottomCenter"],
                        showLessItems: true,
                        showSizeChanger: false
                    }}
                />
            </div>
        </div>
    );
}
export default PostManagement;