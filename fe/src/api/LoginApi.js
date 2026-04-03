import anxiosClient from "./AxiosClient"
const loginApi={
    loginUser:(payload) =>{
        return anxiosClient.post("/api/auth/login",payload)
    },
}
export default loginApi;