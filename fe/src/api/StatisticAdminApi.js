import axiosClient from "./AxiosClient";
const statisticAdminApi={
    getAllAdminPost: ()=>{
        return axiosClient.get("api/posts/statistic/get-post-data-chart")
    },
    getUserStatistic:()=>{
        return axiosClient.get("api/auth/statistic/get-user-total")
    },
    getPostStatistic:()=>{
        return axiosClient.get("api/posts/statistic/get-post-total")
    },
    getDocumentStatistic:()=>{
        return axiosClient.get("api/document/statistic/get-document-total")
    },
    getNotificationStatistic:()=>{
        return axiosClient.get("api/notification/statistic/get-notification-total")
    },
    getTop4EarlyPost:()=>{
        return axiosClient.get("api/posts/statistic/get-top-4-post-statistic")
    }
}

export default statisticAdminApi;