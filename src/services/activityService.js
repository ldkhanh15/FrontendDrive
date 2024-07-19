import axios from '../lib/axios'
export const getActivity = (id) => {
    return axios.get(`/api/v1/folders/${id}/activities`)
}