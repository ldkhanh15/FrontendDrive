import axios from '../lib/axios'

export const getAllFolder = () => {
    return axios.get('/api/v1/folders')
}

export const getDetailFolder = (id) => {
    return axios.get(`/api/v1/folders/${id}`)
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
    return axios.delete(`/api/v1/folders/${folderId}/files/${id}/soft-delete`)
}
export const deleteFolder=(id)=>{
    return axios.delete(`/api/v1/folders/${id}/soft-delete`)
}