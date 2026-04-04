const MessageContent = ({avatar,name,classes,message,likes})=>{
    return(
        <div style={{marginBottom:"20px",marginLeft:"20px",display:"flex",flexDirection:"row",marginTop:"10px",alignItems:"center"}}>
            <img src={avatar} alt="avatar" style={{height:"34px",width:"34px",borderRadius:"50%",marginTop:"5px",marginBottom:"auto"}} />
            <div style={{backgroundColor:"white",marginLeft:"15px",display:"flex",flexDirection:"column",paddingLeft:"10px",paddingRight:"10px",borderRadius:"7px",paddingTop:"5px",paddingBottom:"5px"}}>
                <div style={{fontSize:"12px",color:"rgb(110, 110, 110)"}}>{name}</div>
                <div style={{fontSize:"15px",color:"rgb(0, 0, 0)"}}>{message}</div>
            </div>
        </div>
    )
}
export default MessageContent;
