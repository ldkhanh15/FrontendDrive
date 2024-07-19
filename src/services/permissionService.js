import axios from '../lib/axios'

export const getAllPermission = (page=1,size=10) => {
    return axios.get(`/api/v1/admin/permissions?page=${page}&size=${size}`)
}
export const createPermission = (data) => {
    return axios.post('/api/v1/admin/permissions', data);
}
export const updatePermission=(data)=>{
    return axios.put('/api/v1/admin/permissions', data);
}
export const deletePermission=(id)=>{
    return axios.delete(`/api/v1/admin/permissions/${id}`)
}