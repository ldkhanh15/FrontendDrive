import axios from '../lib/axios'

export const getAllPermission = (page=1,size=10) => {
    return axios.get(`/api/v1/permissions?page=${page}&size=${size}`)
}
export const createPermission = (data) => {
    return axios.post('/api/v1/permissions', data);
}
export const updatePermission=(data)=>{
    return axios.put('/api/v1/permissions', data);
}
export const deletePermission=(id)=>{
    return axios.delete(`/api/v1/permissions/${id}`)
}