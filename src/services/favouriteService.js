import axios from '../lib/axios'

export const getAllFavourite = () => {
    return axios.get(`/api/v1/user/favourites`)
}
export const addFavourite = (data) => {
    return axios.post('/api/v1/user/favourites', data)
}
export const deleteFavourite = (id) => {
    return axios.delete(`/api/v1/user/favourites/${id}`)
}
