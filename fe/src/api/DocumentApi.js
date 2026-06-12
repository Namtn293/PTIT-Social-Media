import axiosClient from "./AxiosClient";

const documentApi = {
    getAllDocuments: () => {
        return axiosClient.post("/api/document/get");
    },
    createDocument: (data, file, image) => {
        const formData = new FormData();
        formData.append("documentDTO", new Blob([JSON.stringify(data)], { type: "application/json" }));
        if (file) formData.append("file", file);
        if (image) formData.append("image", image);
        return axiosClient.post("/api/document/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    deleteDocument: (documentId) => {
        return axiosClient.post(`/api/document/delete/${documentId}`);
    },
    getAllSubjects: () => {
        return axiosClient.get("/api/document/subjects");
    }
};

export default documentApi;
