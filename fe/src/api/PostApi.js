import axiosClient from "./AxiosClient";
const postApi={
    getAllAdminPost: ()=>{
        return axiosClient.get("api/posts/admin/get/all")
    },
    getAllHomePosts:()=>{
        return axiosClient.get("/api/posts/get/all");
    }
}

export default postApi;