import axiosClient from "./AxiosClient"
const userInfoApi={
    getUserInfo : (userName)=>{
        return axiosClient.post(`/api/user-info/get/${userName}`);
    },
    getAllUserInfo:()=>{
        return axiosClient.get("/api/user-info/get/all");
    },
    getOnlineUsers:()=>{
        return axiosClient.get("/api/user-info/online");
    },
    lockUserInfo:(userName)=>{
        return axiosClient.post(`/api/user-info/ban/${userName}`);
    },
    activeUserInfo:(userName)=>{
        return axiosClient.post(`/api/user-info/active/${userName}`);
    },
    deleteUserInfo:(id)=>{
        return axiosClient.post(`/api/user-info/delete/${id}`);
    },
    updateUserInfo: (userName, data, file) => {
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
        if (file) formData.append("file", file);
        return axiosClient.post(`/api/user-info/update/${userName}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
}

export default userInfoApi;