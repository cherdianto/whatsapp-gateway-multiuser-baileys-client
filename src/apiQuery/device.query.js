import axios from "axios"
import axiosJWT from "../utils/axiosJWT";
axios.defaults.withCredentials = true;

const apiUrl = process.env.REACT_APP_ENV === 'development' ? process.env.REACT_APP_API_BASE_DEV : process.env.REACT_APP_API_BASE_PROD

export const getDatas = async (accessToken) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.get(`${apiUrl}/device/all`, config)
        // console.log(response)
        return response.data.device
    } catch (error) {
        throw new Error(error)
    }
}

export const addData = async ({accessToken, values}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.post(`${apiUrl}/device/add`, values, config)
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
        const response = await axiosJWT.delete(`${apiUrl}/device/delete/${id}`, config)
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

    // console.log(config)

    try {
        const response = await axiosJWT.put(`${apiUrl}/device/update/${values.id}`, values, config)
        // console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}

export const logout = async (apiKey) => {
    try {
        const response = await axios.get(`${apiUrl}/device/logout?key=${apiKey}`)
        // console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}