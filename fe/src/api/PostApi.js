import axiosClient from "./AxiosClient";
const postApi={
    getAll: ()=>{
        return axiosClient.get("api/posts/all")
    }
}

export default postApi;