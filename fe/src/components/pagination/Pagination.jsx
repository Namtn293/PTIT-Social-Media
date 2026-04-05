import React from "react";
import "./Pagination.css"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
const Pagination=({currentPage,totalPages,onPageChange})=>{
    const pages=[];
    for (let i=1;i<=totalPages;i++){
        pages.push(i);
    }


    return (
        <div className="pagination">
            <button disabled={currentPage===1}
            onClick={()=>onPageChange(currentPage-1)}
            style={{marginRight:"5px"}}>
                <LeftOutlined></LeftOutlined>
            </button>

            {pages.map((page)=>{
                return (
                    <button key={page}
                    className={currentPage==page?"active":""}
                    onClick={()=>onPageChange(page)}>
                        {page}
                    </button>
                )
            })}

            <button disabled={currentPage===totalPages}
            onClick={()=>onPageChange(currentPage+1)}
            style={{marginLeft:"5px"}}>
                <RightOutlined></RightOutlined>
            </button>
        </div>
    )
}

export default Pagination;