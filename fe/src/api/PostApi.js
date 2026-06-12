import axiosClient from "./AxiosClient";
const postApi = {
    getAllAdminPost: () => {
        return axiosClient.get("api/posts/admin/get/all")
    },
    getAllHomePosts: () => {
        return axiosClient.get("/api/posts/get/all");
    },
    createPost: (data) => {
        return axiosClient.post("/api/posts/create", data);
    },
    likePost: (id) => {
        return axiosClient.post(`/api/like/interact/${id}`);
    },
    savePost: (id) => {
        return axiosClient.post(`/api/save/interact/${id}`);
    },
    reportPost: (id) => {
        return axiosClient.post(`/api/report/interact/${id}`);
    },
    getComments: (postId) => {
        return axiosClient.post(`/api/comment/get/${postId}`);
    },
    createComment: (data) => {
        return axiosClient.post("/api/comment/create", data);
    },
}

export default postApi;
