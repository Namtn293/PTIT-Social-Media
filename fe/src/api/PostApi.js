import axiosClient from "./AxiosClient";
const postApi={
    getAllAdminPost: ()=>{
        return axiosClient.get("api/posts/admin/get/all")
    }
}

export default postApi;