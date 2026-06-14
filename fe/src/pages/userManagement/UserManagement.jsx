import { Table, Tag, Space, Button,Input } from "antd";
import {useEffect,useState} from "react"
import {PlusOutlined, EditOutlined, LockOutlined, DeleteOutlined,SearchOutlined } from "@ant-design/icons";
import "../admin-common.css";
import "./UserManagement.css";
import userInfoApi from "../../api/UserInfoApi"

function UserManagement() {

  const [data,setData]=useState([]);  
  const [searchText,setSearchText]=useState("");
  const [currentPage,setCurrentPage]=useState(1);
  const onLock=async(record)=>{
    try{
    const newStatus=record.status==="ACTIVE"?"BANDED":"ACTIVE";
    let response;
    const newData=data.map((item)=>{
        if (item.userId===record.userId) return {...item,status:newStatus};
        return item;
    });
    if (record.status==="ACTIVE"){
        response=await userInfoApi.lockUserInfo(record.userName);
    } else {
        response=await userInfoApi.activeUserInfo(record.userName);
    }
    setData(newData);}
    catch(err){
        console.log("Lỗi gọi api "+err);
    }
  }

  const onDelete=async(record)=>{
    try {
        let response;
        response=await userInfoApi.deleteUserInfo(record.userId);
        const newData=data.filter((item)=>item.userId!=record.userId);
        setData(newData);
    } catch(err){
        console.log("Lỗi xóa người dùng "+err);
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      width:"5%",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      key: "userName",
      width:"13%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width:360,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width:"10%",
      render:(role)=>{
        if (role==="STUDENT") return "Sinh viên";
        return "Quản trị viên";
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {status === "ACTIVE" ? "Hoạt động" : "Bị cấm"}
        </Tag>
      ),
      width:"15%",
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button icon={<LockOutlined />}  onClick={()=> onLock(record)} />
          <Button danger icon={<DeleteOutlined />}  onClick={()=> onDelete(record)}  />
        </Space>
      ),
      width:"23%",
    },
  ];

  useEffect(()=>{
    const fetchData=async()=>{
        try{
        const response=await userInfoApi.getAllUserInfo();
        setData(response.data.data);}
        catch(err){
            console.log("Lỗi lấy dữ liệu "+err);
        }
    } 
    fetchData();
  },[])

  const filterData=data.filter((item)=>{
    return(
        item.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
    )
  })

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div className="admin-search-wrap">
          <Input 
            onChange={(e) => setSearchText(e.target.value)} 
            size="large" 
            style={{ width: "400px" }} 
            placeholder="Tìm kiếm người dùng..." 
          />
          <Button 
            icon={<SearchOutlined />} 
            size="large" 
            type="primary"
          >
            Tìm kiếm
          </Button>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
        >
          Tạo mới
        </Button>
      </div>

      <div className="admin-page-card">
        <Table 
          columns={columns} 
          dataSource={filterData} 
          rowKey="userId"
          scroll={{ x: "max-content", y: "calc(100vh - 310px)" }} 
          pagination={{
            current: currentPage,
            pageSize: 10,
            onChange: (page) => setCurrentPage(page),
            position: ["bottomCenter"],
            showLessItems: true,
            showSizeChanger: false
          }}
        />
      </div>
    </div>
  );
}

export default UserManagement;