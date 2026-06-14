import { Button, Checkbox, Col, Form, Input, message, Typography } from "antd";
import background from "../../assets/background.png"
import logo from "../../assets/logo.png"
import "./LoginPage.css"
import { useNavigate } from "react-router-dom";
const {Title,Paragraph,Link}=Typography;
import { UserOutlined,LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import loginApi from "../../api/LoginApi"
import {jwtDecode} from "jwt-decode"

function LoginPage(){
    const navigate=useNavigate();

    const onFinish=async(values)  =>{
        const {userName,password}=values;

        if (!userName || !password){
            message.error("Thiếu thông tin đăng nhập");
            return;
        }

        try{
            const response=await loginApi.loginUser(values);
            if (response.data.status==401){
                message.error("Mật khẩu không đúng, vui lòng thử lại!");
            } else if (response.data.status==409){
                message.error("Tên đăng nhập không đúng, vui lòng thử lại!");
            } else if (response.data.status==404){
                message.error("Tài khoản đã bị khóa!");
            } else{
                message.success("Đăng nhập thành công!");
                const jwt=jwtDecode(response.data.message);
                localStorage.setItem("token", response.data.message); 
                localStorage.setItem("role",jwt.roles[0]);
                localStorage.setItem("userId",jwt.userId);
                localStorage.setItem("userName", jwt.sub);
                console.log(localStorage.getItem("userId"));
                window.dispatchEvent(new Event("authChange"));
                navigate("/");
            }
        } catch(error){
            message.error("Đăng nhập thất bại, vui lòng thử lại")
        }        
    }

    return (
        <div className="login"
            style={{backgroundImage :`url(${background})`,
        }}>
            <Form className="form_login"
            layout="vertical"
            onFinish={onFinish}
            >
                <Form.Item>
                    <img src={logo} alt="logo" style={{ width: '110px',marginTop:'0px',marginBottom:'0px'}} />
                </Form.Item>
                <Form.Item>
                    <Title level={1} style={{marginTop:'0px',marginBottom:'0px'}}>
                        Đăng nhập
                    </Title>
                </Form.Item>
                <Form.Item
                    label={<span style={{fontSize:'15px'}}>Tài khoản</span>}
                    name={"userName"}
                    rule={{require:true,message:"Vui lòng nhập tên đăng nhập"}}
                    style={{marginBottom:'14px',marginTop:'0px'}}
                >
                <Input prefix={<UserOutlined/>} placeholder="Vui lòng nhập mật khẩu" style={{height:'50px',backgroundColor: "white"}}></Input>
                </Form.Item>

                <Form.Item
                    label={<span style={{fontSize:'15px'}}>Mật khẩu </span>}
                    name={"password"}
                    rule={{require:true,message:"Vui lòng nhập mật khẩu"}}
                    style={{marginBottom:'14px',marginTop:'0px'}}
                >
                    <Input.Password prefix={<LockOutlined/>} placeholder="Vui lòng nhập mật khẩu" style={{height:'50px',backgroundColor: "white"}}></Input.Password>
                </Form.Item>
                
                <Checkbox style={{marginBottom:'10px',marginTop:'0px'}}>Ghi nhớ</Checkbox>

                <Button type="primary" htmlType="submit" style={{height:'45px',fontSize:'17px',borderRadius:'10px'}}>
                    Đăng nhập
                </Button>

                <Paragraph style={{textAlign:'end',height:'20px',marginTop:'10px'}}>
                    <span style={{color:'black',fontSize:'15px'}}>Chưa có tài khoản?</span>
                    <Link onClick={() => navigate("/register")}> Đăng kí</Link>
                </Paragraph>
            </Form>
        </div>
    )
}
export default LoginPage;