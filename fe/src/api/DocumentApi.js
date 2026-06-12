import axiosClient from "./AxiosClient";

const documentApi = {
    /**
     * Lấy danh sách tất cả tài liệu học tập
     * URL: POST /api/document/get
     * 
     * Dữ liệu nhận về từ Backend (JSON):
     * {
     *   "status": "200",                     // String - Trạng thái phản hồi
     *   "message": "Get all document success",// String - Thông điệp
     *   "data": [                            // Array - Danh sách tài liệu
     *     {
     *       "id": 1,                             // Long - ID tài liệu
     *       "title": "Đề cương ôn thi môn X",    // String - Tiêu đề tài liệu
     *       "fileURL": "https://...",            // String - Link download file tài liệu
     *       "ImageURL": "https://...",           // String - Link ảnh nền/ảnh bìa tài liệu
     *       "uploaderName": "Tên người gửi",     // String - Tên người đăng tài liệu
     *       "size": "N/A",                       // String - Dung lượng file
     *       "createdAt": "09/04/2026 12:00 SA",  // String - Ngày giờ tạo
     *       "createBy": "username_dang_tin"      // String - Tên tài khoản người đăng (dùng để lọc "Tài liệu của tôi")
     *     }
     *   ]
     * }
     */
    getAllDocuments: () => {
        return axiosClient.post("/api/document/get");
    },

    /**
     * Lấy danh sách tài liệu cá nhân
     * URL: POST /api/document/mine
     * 
     * Dữ liệu nhận về từ Backend (JSON):
     * {
     *   "status": "200",                     // String - Trạng thái phản hồi
     *   "message": "Get my document list success",// String - Thông điệp
     *   "data": [                            // Array - Danh sách tài liệu của tôi
     *     {
     *       "id": 1,                             // Long - ID tài liệu
     *       "title": "Đề cương ôn thi môn X",    // String - Tiêu đề tài liệu
     *       "fileURL": "https://...",            // String - Link download file tài liệu
     *       "ImageURL": "https://...",           // String - Link ảnh nền/ảnh bìa tài liệu
     *       "uploaderName": "Tên người gửi",     // String - Tên người đăng tài liệu
     *       "size": "N/A",                       // String - Dung lượng file
     *       "createdAt": "09/04/2026 12:00 SA",  // String - Ngày giờ tạo
     *       "createBy": "username_dang_tin"      // String - Tên tài khoản người đăng (dùng để lọc "Tài liệu của tôi")
     *     }
     *   ]
     * }
     */
    getMyDocuments: () => {
        return axiosClient.post("/api/document/mine");
    },

    /**
     * Đăng tải tài liệu mới lên hệ thống
     * URL: POST /api/document/create
     * Headers: { "Content-Type": "multipart/form-data" }
     * 
     * Dữ liệu gửi đi (FormData):
     * - documentDTO: Blob chứa chuỗi JSON (type: application/json):
     *   {
     *     "title": "Tiêu đề tài liệu" // String (Bắt buộc)
     *   }
     * - file: File thực tế cần upload (PDF, DOC, DOCX)
     * - image: File ảnh bìa (Tùy chọn)
     * 
     * Dữ liệu nhận về từ Backend (JSON):
     * {
     *   "status": "200",                     // String - Trạng thái thành công
     *   "message": "Create document success",  // String - Thông điệp
     *   "data": null                         // null hoặc String
     * }
     */
    createDocument: (data, file, image) => {
        const formData = new FormData();
        formData.append("documentDTO", new Blob([JSON.stringify(data)], { type: "application/json" }));
        if (file) formData.append("file", file);
        if (image) formData.append("image", image);
        return axiosClient.post("/api/document/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    /**
     * Xóa một tài liệu học tập
     * URL: POST /api/document/delete/{documentId}
     * 
     * Dữ liệu nhận về từ Backend (JSON):
     * {
     *   "status": "200",                     // String - Trạng thái thành công
     *   "message": "Delete document success",  // String - Thông điệp
     *   "data": null                         // null
     * }
     */
    deleteDocument: (documentId) => {
        return axiosClient.post(`/api/document/delete/${documentId}`);
    }
};

export default documentApi;
