import axios from '../lib/axios'
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