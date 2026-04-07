import { Table, Tag, Space, Button,Input } from "antd";
import {useEffect,useState} from "react"
import {PlusOutlined, EditOutlined, LockOutlined, DeleteOutlined,SearchOutlined } from "@ant-design/icons";
import "./UserManagement.css";
import userInfoApi from "../../api/UserInfoApi"

function UserManagement() {

  const [data,setData]=useState([]);  
  
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
      width:60,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      key: "userName",
      width:160,
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
      width:120,
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
      width:120,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<LockOutlined />}  onClick={()=> onLock(record)} />
          <Button danger icon={<DeleteOutlined />}  onClick={()=> onDelete(record)}  />
        </Space>
      ),
      width:160,
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

  return (
    <div className="user-management-container">
        <div style={{marginLeft:0,marginBottom:20}}>
            <Input size="large" style={{ width: "500px",borderRadius:"5px",fontSize:16,height:35}} placeholder="Tìm kiếm người dùng" />
                    
            <Button icon={<SearchOutlined/>} size="large" type="primary" style={{height:35,borderRadius:"5px", marginLeft:10 }}>
                Tìm kiếm
            </Button>

            <Button type="primary" icon={<PlusOutlined/>} size="large" style={{marginLeft:"450px",width:"120px",borderRadius:"5px"}}>Tạo mới</Button>
        </div>
        <Table columns={columns} dataSource={data} scroll={{x:1000}} pagination={{pageSize:5,position:["bottomCenter"]}}/>
    </div>
  );
}

export default UserManagement;