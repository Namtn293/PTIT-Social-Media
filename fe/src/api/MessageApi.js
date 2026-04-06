import axiosClient from "./AxiosClient";

const MessageApi = {
    getAll: () => {
        return axiosClient.get("/api/message/get/all");
    }
};

export default MessageApi;
