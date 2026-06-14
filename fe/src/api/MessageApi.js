import axiosClient from "./AxiosClient";

const MessageApi = {
    getAll: () => {
        return axiosClient.get("/api/message/get/all");
    },
    edit: (id, messageDTO) => {
        return axiosClient.put(`/api/message/edit/${id}`, messageDTO);
    },
    delete: (id) => {
        return axiosClient.delete(`/api/message/delete/${id}`);
    }
};

export default MessageApi;
