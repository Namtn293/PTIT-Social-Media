import "./PostLayout.css"
import React, { useState } from "react";
import {LikeOutlined,CommentOutlined,SaveOutlined,FlagOutlined} from "@ant-design/icons"

const PostLayout = ({report,content,avatar,title,name,time,classes,likes,comments,saves})=>{
    const [likeCount, setLikeCount] = useState(likes);
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        if (liked) {
        setLikeCount(likeCount-1);
        } else {
        setLikeCount(likeCount+1);
        }
        setLiked(!liked);
    };
    
    return(
        <div className="post-card">
            <div className="post-header">
                <img className="avatar" src={"https://static.vecteezy.com/system/resources/previews/036/280/651/large_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"} 
                alt="avatar"
                />
                <div className="user-info">
                    <div className="name-time">
                        <span className="name-post">{name}</span>
                        <span className="classes-post">• {classes}</span>
                        <span className="time-post">• {time}</span>
                    </div>

                    <span className="post-title">{title}</span>
                </div>
            </div>
            
            <div className="post-content">
                {content}
            </div>

            <div className="post-actions">
                <div style={{marginLeft:"10px"}} className={`action ${liked ? "active" : ""}`}
                onClick={handleLike}>
                    <LikeOutlined></LikeOutlined>
                    <span>{likeCount}</span>
                </div>

                <div style={{marginLeft:"20px"}} className="post-comment"
                >
                    <CommentOutlined></CommentOutlined>
                    <span> {comments}</span>
                </div>
                <div style={{marginLeft:"20px"}} className="post-save"
                >
                    <SaveOutlined></SaveOutlined>
                    <span> {saves}</span>
                </div>
                <div style={{marginLeft:"20px"}} className="post-report"
                >
                    <FlagOutlined></FlagOutlined>
                    <span> {report}</span>
                </div>
            </div>
        </div>
    )
}
export default PostLayout;