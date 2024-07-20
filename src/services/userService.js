import axios from '../lib/axios'


//ADMIN

export const getUser = (page, size, type, searchQuery) => {
    return axios.get(`/api/v1/admin/users/${type}?page=${page}&size=${size}&query=${searchQuery}`)
}

export const createUser = (data) => {
    return axios.post(`/api/v1/admin/users`, data)
}

export const updateUser = (data) => {
    return axios.put(`/api/v1/admin/users`, data)
}

export const deleteUser = (id) => {
    return axios.delete(`/api/v1/admin/users/${id}`)
}
export const changeAvatar = (userId, file) => {
    const formData = new FormData();
    formData.append('file', file)
    return axios.post(`/api/v1/admin/users/${userId}/change-avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const changePassword = (userId, data) => {
    return axios.post(`/api/v1/admin/users/${userId}/change-password`, data)
}
export const getActivity = () => {
    return axios.get("/api/v1/activities")
}
export const bulkCreate = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post('/api/v1/admin/users/bulk-create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const activateUser = (id) => {
    return axios.post(`/api/v1/admin/users/${id}/activate`)
}
export const deactivateUser = (id) => {
    return axios.post(`/api/v1/admin/users/${id}/deactivate`)
}


//USER
export const getAccount = () => {
    return axios.get('/api/v1/user/users')
}

export const updateUserByUser = (data) => {
    return axios.put(`/api/v1/user/users`, data)
}
export const changePasswordByUser = (data) => {
    return axios.post('/api/v1/user/users/change-password', data)
}
export const changeAvatarByUser = (file) => {
    const formData = new FormData();
    formData.append('file', file)
    return axios.post(`/api/v1/user/users/change-avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}