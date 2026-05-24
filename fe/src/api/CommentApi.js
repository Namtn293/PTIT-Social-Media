import axiosClient from "./AxiosClient";
const commentApi={
    getAllComment:(postId)=>{
        return axiosClient.post(`/api/comment/get-all/${postId}`);
    },
    createNewComment:(payload)=>{
        return axiosClient.post("/api/comment/create",payload);
    }
}

export default commentApi;