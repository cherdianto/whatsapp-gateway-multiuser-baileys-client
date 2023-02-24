import axios from "axios"
import axiosJWT from "../utils/axiosJWT";
axios.defaults.withCredentials = true;

const apiUrl = process.env.REACT_APP_ENV === 'development' ? process.env.REACT_APP_API_BASE_DEV : process.env.REACT_APP_API_BASE_PROD

export const getAll = async (accessToken) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.get(`${apiUrl}/user/all`, config)
        // console.log(response.data)
        return response.data
    } catch (error) {
        throw new Error(error)
    }
}

// export const postBulk = async ({accessToken, bulkData}) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${accessToken}`
//         },
//     }

//     try {
//         const response = await axiosJWT.post(`${apiUrl}/user/bulk`, bulkData, config)
//         console.log(response)
//         return response
//     } catch (error) {
//         throw new Error(error)
//     }
// }

export const postAdd = async ({accessToken, values}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.post(`${apiUrl}/user/add`, values, config)
        // console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteData = async ({accessToken, id}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.delete(`${apiUrl}/user/delete/${id}`, config)
        // console.log(response)
        // return response
    } catch (error) {
        throw new Error(error)
    }
}

export const updateData = async ({accessToken, values}) => {
    // console.log(values)
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.put(`${apiUrl}/user/update/${values.id}`, values, config)
        // console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}