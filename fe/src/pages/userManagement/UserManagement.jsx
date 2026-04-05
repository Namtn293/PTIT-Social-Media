import { Table, Tag, Space, Button,Input } from "antd";
import {PlusOutlined, EditOutlined, LockOutlined, DeleteOutlined,SearchOutlined } from "@ant-design/icons";
import "./UserManagement.css";
function UserManagement() {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width:60,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
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
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Bị cấm"}
        </Tag>
      ),
      width:120,
    },
    {
      title: "Hành động",
      key: "actions",
      render: () => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Button icon={<LockOutlined />} />
          <Button danger icon={<DeleteOutlined />} />
        </Space>
      ),
      width:160,
    },
  ];

  const data = [
    {
      key: 1,
      id: 1,
      username: "nam123",
      email: "nam@gmail.com",
      role: "Admin",
      status: "active",
    },
  ];

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