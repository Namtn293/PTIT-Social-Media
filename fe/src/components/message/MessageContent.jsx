const MessageContent = ({check,avatar,name,timestamp,message})=>{
    return(
        <>{!check ? (<div style={{marginBottom:"20px",cursor:"pointer",marginLeft:"20px",display:"flex",flexDirection:"row",marginTop:"10px",alignItems:"center"}}>
            <img src={avatar} alt="avatar" style={{height:"34px",width:"34px",borderRadius:"50%",marginTop:"5px",marginBottom:"auto"}} />
            <div style={{backgroundColor:"white",marginLeft:"15px",display:"flex",flexDirection:"column",paddingLeft:"10px",paddingRight:"10px",borderRadius:"7px",paddingTop:"5px",paddingBottom:"5px",maxWidth:"500px"}}>
                <div style={{fontSize:"12px",color:"rgb(110, 110, 110)"}}>{name}</div>
                <div style={{fontSize:"15px",color:"rgb(0, 0, 0)"}}>{message}</div>
                <div style={{marginTop:"4px",fontSize:"10px",color:"rgb(110, 110, 110)"}}>{timestamp}</div>
            </div>
        </div>):
        (
          <div style={{marginBottom:"20px",cursor:"pointer",marginRight:"20px",display:"flex",flexDirection:"row",marginTop:"10px",alignItems:"center",justifyContent:"end"}}>
            <div style={{backgroundColor:"white",marginRight:"15px",display:"flex",flexDirection:"column",paddingLeft:"10px",paddingRight:"10px",borderRadius:"7px",paddingTop:"5px",paddingBottom:"5px",maxWidth:"500px"}}>
                <div style={{fontSize:"12px",color:"rgb(110, 110, 110)"}}>{name}</div>
                <div style={{fontSize:"15px",color:"rgb(0, 0, 0)"}}>{message}</div>
                <div style={{marginTop:"4px",fontSize:"10px",color:"rgb(110, 110, 110)"}}>{timestamp}</div>
            </div>
            <img src={avatar} alt="avatar" style={{height:"34px",width:"34px",borderRadius:"50%",marginTop:"5px",marginBottom:"auto"}} />
        </div>  
        )}
        </>
    )
}
export default MessageContent;
