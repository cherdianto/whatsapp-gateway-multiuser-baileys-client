import axios from "axios"
import axiosJWT from "../utils/axiosJWT";
axios.defaults.withCredentials = true;

const apiUrl = process.env.REACT_APP_ENV === 'development' ? process.env.REACT_APP_API_BASE_DEV : process.env.REACT_APP_API_BASE_PROD

// export const updateProfile = async ({data, accessToken}) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${accessToken}`
//         },
//     }

//     try {
//         const response = await axiosJWT.put(`${apiUrl}/auth/update-profile`, data, config)
//         return response.data.user
//     } catch (error) {
//         throw new Error(error)
//     }
// }

export const getAll = async (accessToken) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.get(`${apiUrl}/dpa/all`, config)
        // console.log(response.data)
        return response.data
    } catch (error) {
        throw new Error(error)
    }
}

export const postBulk = async ({accessToken, bulkData}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.post(`${apiUrl}/dpa/bulk`, bulkData, config)
        console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}

export const postAdd = async ({accessToken, values}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.post(`${apiUrl}/dpa/add`, values, config)
        console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}

export const getNames = async (accessToken) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.get(`${apiUrl}/dpa/names`, config)
        console.log(response)
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
        const response = await axiosJWT.delete(`${apiUrl}/dpa/delete/${id}`, config)
        // console.log(response)
        // return response
    } catch (error) {
        throw new Error(error)
    }
}

export const updateData = async ({accessToken, values}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.put(`${apiUrl}/dpa/update/${values.id}`, values, config)
        console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}