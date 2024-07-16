import axios from '../lib/axios'

export const getAllFolder = () => {
    return axios.get('/api/v1/folders')
}

export const getDetailFolder = (id, itemType) => {
    return axios.get(`/api/v1/folders/${id}/${itemType}`)
}
export const createFolder = (name, parent) => {
    return axios.post('/api/v1/folders', {
        folderName: name,
        enabled: true,
        public: true,
        parent: {
            id: parent
        }
    })
}
export const uploadFile = (folderId, file) => {
    const formData = new FormData();
    formData.append('file', file)
    return axios.post(`/api/v1/folders/${folderId}/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }


    })

}
export const deleteFile = (folderId, id) => {
    return axios.delete(`/api/v1/folders/${folderId}/files/${id}`)
}
export const deleteFolder = (id) => {
    return axios.delete(`/api/v1/folders/${id}`)
}

export const renameFile = (folderId, data) => {
    return axios.put(`/api/v1/folders/${folderId}/files`, data)
}

export const renameFolder = (data) => {
    return axios.put(`/api/v1/folders`, data)
}

export const deleteSoftFile = (folderId, id) => {
    return axios.delete(`/api/v1/folders/${folderId}/files/${id}/soft-delete`)
}
export const deleteSoftFolder = (id) => {
    return axios.delete(`/api/v1/folders/${id}/soft-delete`)
}

export const restoreFile = (folderId, id) => {
    return axios.post(`/api/v1/folders/${folderId}/files/${id}/restore`)
}
export const restoreFolder = (id) => {
    return axios.post(`/api/v1/folders/${id}/restore`)
}

export const getActivity = (id) => {
    return axios.get(`/api/v1/folders/${id}/activities`)
}

export const getAccess = (itemId) => {
    return axios.get(`/api/v1/access-items`, {
        params: {
            itemId: itemId
        }
    })
}

export const addAccess = (accessType, email, id) => {
    return axios.post('/api/v1/access-items', {
        accessType,
        user: {
            email
        },
        item: {
            id
        }
    })
}
export const deleteAccess = (idAccess) => {
    return axios.delete(`/api/v1/access-items/${idAccess}`)
}