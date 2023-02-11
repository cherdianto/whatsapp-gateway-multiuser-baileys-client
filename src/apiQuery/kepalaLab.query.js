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
        const response = await axiosJWT.get(`${apiUrl}/kalab/all`, config)
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
        const response = await axiosJWT.post(`${apiUrl}/kalab/bulk`, bulkData, config)
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
        const response = await axiosJWT.post(`${apiUrl}/kalab/add`, values, config)
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
        const response = await axiosJWT.get(`${apiUrl}/kalab/names`, config)
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
        const response = await axiosJWT.delete(`${apiUrl}/kalab/delete/${id}`, config)
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
        const response = await axiosJWT.put(`${apiUrl}/kalab/update/${values.id}`, values, config)
        console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}