import axios from '../lib/axios'


//ADMIN
export const getAllFolder = (page, pageSize, type, searchQuery) => {
    return axios.get(`/api/v1/admin/folders/${type}?page=${page}&size=${pageSize}&query=${searchQuery}`)
}
export const getDetailFolder = (id, itemType) => {
    return axios.get(`/api/v1/admin/folders/${id}/${itemType}`)
}
export const createFolder = (folderId,data) => {
    return axios.post(`/api/v1/admin/folders/${folderId}`,data )
}
export const deleteFolder = (id) => {
    return axios.delete(`/api/v1/admin/folders/${id}`)
}
export const renameFolder = (folderId,data) => {
    return axios.put(`/api/v1/admin/folders/${folderId}`, data)
}
export const deleteSoftFolder = (id) => {
    return axios.delete(`/api/v1/admin/folders/${id}/soft-delete`)
}
export const restoreFolder = (id) => {
    return axios.post(`/api/v1/admin/folders/${id}/restore`)
}

//USER
export const getFolderByUser = (id,itemType) => {
    return axios.get(`/api/v1/user/folders/${itemType}`)
}
export const getDetailFolderByUser = (folderId,query) => {
    return axios.get(`/api/v1/user/folders/${folderId}?query=${query}`)
}
export const createFolderByUser = (folderId,data) => {
    return axios.post(`/api/v1/user/folders/${folderId}`, data)
}
export const renameFolderByUser = (folderId,data) => {
    return axios.put(`/api/v1/user/folders/${folderId}`, data)
}
export const softDeleteFolderByUser = (folderId) => {
    return axios.delete(`/api/v1/user/folders/${folderId}/soft-delete`)
}
export const deleteFolderByUser = (folderId) => {
    return axios.delete(`/api/v1/user/folders/${folderId}`)
}
export const restoreFolderByUser = (folderId) => {
    return axios.post(`/api/v1/user/folders/${folderId}/restore`)
}
