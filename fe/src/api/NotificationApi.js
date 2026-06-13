import axiosClient from "./AxiosClient";

const notificationApi = {
    getMyNotifications: () => {
        return axiosClient.get("/api/notifications/my");
    },
    getAllNotifications: () => {
        return axiosClient.get("/api/notifications/all");
    },
    createNotification: (notice) => {
        return axiosClient.post("/api/notifications/create", notice);
    },
    deleteNotification: (id) => {
        return axiosClient.post(`/api/notifications/delete/${id}`);
    },
    markAsRead: (id) => {
        return axiosClient.post(`/api/notifications/read/${id}`);
    }
};

export default notificationApi;
