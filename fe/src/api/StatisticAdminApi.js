import axiosClient from "./AxiosClient";
const statisticAdminApi = {
    getAllAdminPost: () => {
        return axiosClient.get("api/posts/statistic/get-post-data-chart")
    },
    getAdminDashboardStats: () => {
        return axiosClient.get("api/posts/statistic/dashboard-stats")
    },
    getRecentPosts: () => {
        return axiosClient.get("api/posts/admin/recent")
    }
}

export default statisticAdminApi;