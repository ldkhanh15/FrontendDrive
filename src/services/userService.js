import axios from '../lib/axios'

export const getUser=()=>{
    return axios.get("/api/v1/users")
}

export const getActivity=()=>{
    return axios.get("/api/v1/activities")
}