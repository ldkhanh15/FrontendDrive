import axios from '../lib/axios'

export const getAllRole=(page, pageSize)=>{
    return axios.get(`/api/v1/roles?page=${page}&size=${pageSize}`)
}
export const createRole=(data)=>{
    return axios.post('/api/v1/roles',data)
}
export const updateRole=(data)=>{
    return axios.put('/api/v1/roles',data) 
}
export const deleteRole=(id)=>{
    return axios.delete(`/api/v1/roles/${id}`)
}