import axiosClient from "./AxiosClient";
const statisticAdminApi={
    getAllAdminPost: ()=>{
        return axiosClient.get("api/posts/statistic/get-post-data-chart")
    },
}

export default statisticAdminApi;