import axiosClient from "./AxiosClient"
const userInfoApi={
    getUserInfo : (userName)=>{
        return axiosClient.post(`/api/user-info/get/${userName}`);
    },
    getAllUserInfo:()=>{
        return axiosClient.get("/api/user-info/get/all");
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
}

export default userInfoApi;