import {CloseOutlined} from "@ant-design/icons"
import { Button, Input, Select } from "antd";
import { useState } from "react";

const NoticeCreate = ({onClose,onSubmit})=>{
    const [content,setContent] = useState("");
    const [userName,setUserName] = useState("");
    const [submitData,setSubmitData] = useState({})

    const handleSubmit = ()=>{
        const data = {
            content: content,
            userName: userName,
            createAt: new Date().toISOString()
        };

        if(onSubmit){
            onSubmit(data);
        }

        onClose();
    }

    return(
        <>
         <div style={{
            position:"fixed",
            top:0,
            left:0,
            width:"100%",
            height:"100vh",
            zIndex:"1",
            display:"flex",
            backgroundColor:"#0000003d"}}>
            
            <div className="popup wrap"
                style={{
                    width:"500px",
                    height:"300px",
                    backgroundColor:"#ffffff",
                    borderRadius:"10px",
                    border:"1px solid #b6acac",
                    margin:"auto"
                }}
            >
                <div className="close-btn-wrap" style={{width:"100%", display:"flex"}}>
                    <div
                        style={{
                            fontSize:"25px",
                            fontWeight:"800",
                            margin:"10px 0 0 30%"
                        }}
                    >Tạo thông báo</div>
                    <Button className="close-btn" 
                    icon={<CloseOutlined/>}
                    onClick={onClose}
                    style={{
                        backgroundColor:"#ffffff",
                        padding:"0",
                        width:"30px",
                        height:"30px",
                        border:"none",
                        borderRadius:"50%",
                        margin:"10px 10px 0 auto",
                        outline:"none"
                    }}
                    ></Button>
                </div>
                <div className="form-notice-container"
                    style={{
                        width:"100%",
                        height:"65%",
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        flexDirection:"column",
                        gap:"10%"
                    }}
                >
                    <div className="content-wrap" style={{width:"80%"}}>
                        <div className="content" style={{color:"#686767"}}>Nội dung</div>
                        <Input className="content-input"
                            placeholder="Nhập nội dung thông báo"
                            onChange={(e)=>setContent(e.target.value)}
                            style={{
                                width:"100%",
                                borderRadius:"5px",
                                margin:"10px 0 0 0"
                            }}
                        ></Input>
                    </div>
                    <div className="content-wrap" style={{width:"80%"}}>
                        <div className="user-give" style={{color:"#686767"}}>Người nhận</div>
                        <Input className="user-give-input"
                            placeholder="nhập người nhận"
                            onChange={(e)=>setUserName(e.target.value)}
                            style={{
                                width:"100%",
                                borderRadius:"5px",
                                margin:"10px 0 0 0"
                            }}
                        ></Input>
                    </div>
                </div>

                <div className="submit-btn-wrap" style={{width:"100%", height:"20%", display:"flex"}}>
                    <Button className="submit-btn" 
                    onClick={handleSubmit}
                    size="medium"
                    style={{
                        borderRadius:"15px",
                        margin:"auto",
                        backgroundColor:"#1677ff",
                        color:"#ffffff",
                        outline:"none"
                    }}
                    >Xác nhận</Button>
                </div>
            </div>
         </div>
        </>
    )
}
export default NoticeCreate;