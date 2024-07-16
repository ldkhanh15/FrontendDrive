import axios from '../lib/axios'

export const getUser = (page,size) => {
    return axios.get(`/api/v1/users?page=${page}&size=${size}`)
}

export const getActivity = () => {
    return axios.get("/api/v1/activities")
}