import axiosClient from "./AxiosClient"
const registerApi={
    registerUser : (payload)=>{
        return axiosClient.post("/api/auth/register",payload);
    },
}

export default registerApi;