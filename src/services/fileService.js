import axios from '../lib/axios'

//ADMIN
export const uploadFile = (folderId, file) => {
    const formData = new FormData();
    formData.append('file', file)
    return axios.post(`/api/v1/admin/folders/${folderId}/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const deleteFile = (folderId, id) => {
    return axios.delete(`/api/v1/admin/folders/${folderId}/files/${id}`)
}
export const renameFile = (folderId,fileId, data) => {
    return axios.put(`/api/v1/admin/folders/${folderId}/files/${fileId}`, data)
}
export const deleteSoftFile = (folderId, id) => {
    return axios.delete(`/api/v1/admin/folders/${folderId}/files/${id}/soft-delete`)
}
export const restoreFile = (folderId, id) => {
    return axios.post(`/api/v1/admin/folders/${folderId}/files/${id}/restore`)
}
export const uploadMultiFile = (folderId, files) => {
    const formData = new FormData();
    files.map(file => formData.append('files', file))
    return axios.post(`/api/v1/admin/folders/${folderId}/files/multipart`, formData, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    })
}


//USER
export const getAFileByUser = (folderId, fileId) => {
    return axios.get(`/api/v1/user/folders/${folderId}/files/${fileId}`)
}
export const uploadFileByUser = (folderId, file) => {
    const formData = new FormData();
    formData.append('file', file)
    return axios.post(`/api/v1/user/folders/${folderId}/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const deleteFileByUser = (folderId, id) => {
    return axios.delete(`/api/v1/user/folders/${folderId}/files/${id}`)
}
export const renameFileByUser = (folderId,fileId, data) => {
    return axios.put(`/api/v1/user/folders/${folderId}/files/${fileId}`, data)
}
export const deleteSoftFileByUser = (folderId, id) => {
    return axios.delete(`/api/v1/user/folders/${folderId}/files/${id}/soft-delete`)
}
export const restoreFileByUser = (folderId, id) => {
    return axios.post(`/api/v1/user/folders/${folderId}/files/${id}/restore`)
}
export const downloadFileByUser = (folderId, id) => {
    return axios.post(`/api/v1/user/folders/${folderId}/files/${id}/download`)
}
export const uploadMultiFileByUser = (folderId, files) => {
    const formData = new FormData();
    files.map(file => formData.append('files', file))
    return axios.post(`/api/v1/user/folders/${folderId}/files/multipart`, formData, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    })
}
