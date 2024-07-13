import axios from '../lib/axios'

export const login = (email, password) => {
    return axios.post("/api/v1/auth/login", {
        email, password
    })
}
export const logout = () => {
    return axios.post("/api/v1/auth/logout")
}
export const getAccount = () => {
    return axios.get("/api/v1/auth/account")
}
export const register = (email,password,name) => {
    return axios.post("/api/v1/auth/register", {
        email,password,name
    })
}