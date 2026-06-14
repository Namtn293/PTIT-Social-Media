import { Button,  Form, Input, Typography,message } from "antd";
import background from "../../assets/background.png"
import logo from "../../assets/logo.png"
import "./RegisterPage.css"
import { useNavigate } from "react-router-dom";
const {Title,Paragraph,Link}=Typography;
import { LockOutlined,UserOutlined,MailOutlined,IdcardOutlined} from "@ant-design/icons";
import { useState } from "react";
import regiterApi from "../../api/RegisterApi"
function Register(){
    const navigate=useNavigate();
    const [loading,setLoading] =useState(false);
    
    const onFinish= async(values) =>{
        setLoading(true);
        const {userName,password,fullName,email}=values;
        if (!userName || !password || !fullName || !email){
                message.error("Thiếu thông tin đăng nhập");
                return;
        }
        setLoading(true);
        try{
            const response=await regiterApi.registerUser(values);
            if (response.data.status==409)  message.error("Trùng tên đăng nhập!");
                else if (response.data.status==401)  message.error("Email đã được sử dụng!");
                else{
                    message.success("Đăng kí tài khoản thành thông!");
                    navigate("/login");}
        } catch(error){
            message.error("Đăng ký tài khoản thất bại");
        } finally {
            setLoading(false);
        }

    }
    return (
        <div className="register"
                    style={{backgroundImage :`url(${background})`,
                }}>
                    <Form className="form_register"
                    layout="vertical" onFinish={onFinish}>
                        <Form.Item>
                            <img src={logo} alt="logo" style={{ width: '110px',marginTop:'0px',marginBottom:'0px'}} />
                        </Form.Item>
                        <Form.Item>
                            <Title level={1} style={{marginTop:'0px',marginBottom:'0px'}}>
                                Đăng kí
                            </Title>
                        </Form.Item>

                        <Form.Item
                            label={<span style={{fontSize:'15px'}}>Họ và tên</span>}
                            name={"fullName"}
                            rule={{require:true,message:"Vui lòng nhập họ và tên"}}
                            style={{marginBottom:'14px',marginTop:'0px'}}
                        >
                            <Input
                            prefix={<IdcardOutlined/>}
                            placeholder="Vui lòng nhập họ và tên" style={{height:'50px'}}>
                            </Input>
                        </Form.Item>
                        
                        <Form.Item
                            label={<span style={{fontSize:'15px'}}>Tài khoản</span>}
                            name={"userName"}
                            rule={{require:true,message:"Vui lòng nhập tên đăng nhập"}}
                            style={{marginBottom:'14px',marginTop:'0px'}}
                        >
                            <Input 
                            prefix={<UserOutlined/>}
                            placeholder="Vui lòng nhập tên đăng nhập" style={{height:'50px'}}>
                            </Input>
                        </Form.Item>
        
                        <Form.Item
                            label={<span style={{fontSize:'15px'}}>Email</span>}
                            name={"email"}
                            rule={{require:true,message:"Vui lòng nhập email"}}
                            style={{marginBottom:'14px',marginTop:'0px'}}
                        >
                            <Input 
                            prefix={<MailOutlined/>}
                            placeholder="Vui lòng nhập email" style={{height:'50px'}}>
                            </Input>
                        </Form.Item>
                        
                        <Form.Item
                            label={<span style={{fontSize:'15px'}}>Mật khẩu </span>}
                            name={"password"}
                            rule={{require:true,message:"Vui lòng nhập mật khẩu"}}
                            style={{marginBottom:'14px',marginTop:'0px'}}
                        >
                            <Input.Password prefix={<LockOutlined/>} placeholder="Vui lòng nhập mật khẩu" style={{height:'50px'}}></Input.Password>
                        </Form.Item>
                                
                        <Button htmlType="submit" type="primary" style={{height:'45px',fontSize:'17px',borderRadius:'10px',marginTop:'10px'}}>
                            Đăng kí
                        </Button>
        
                        <Paragraph style={{textAlign:'end',height:'20px',marginTop:'10px'}}>
                            <span style={{color:'black',fontSize:'15px'}}>Đã có tài khoản </span>
                            <Link onClick={() =>navigate("/login")}> Đăng nhập</Link>
                        </Paragraph>
                    </Form>
                </div>
    )
}
export default Register;