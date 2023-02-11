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
        const response = await axiosJWT.get(`${apiUrl}/laboran/all`, config)
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
        const response = await axiosJWT.post(`${apiUrl}/laboran/bulk`, bulkData, config)
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
        const response = await axiosJWT.post(`${apiUrl}/laboran/add`, values, config)
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
        const response = await axiosJWT.get(`${apiUrl}/laboran/names`, config)
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
        const response = await axiosJWT.delete(`${apiUrl}/laboran/delete/${id}`, config)
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
        const response = await axiosJWT.put(`${apiUrl}/laboran/update/${values.id}`, values, config)
        console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}



export const logoutUser = async () => {
    try {
        const response = await axios.get(`${apiUrl}/auth/logout`)
        return response.data.user
    } catch (error) {
        throw new Error(error)
    }
}

export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${apiUrl}/auth/register`, formData)
        console.log(response)
        return response
    } catch (error) {
        console.log('error di register')
        throw new Error(error)
    }
}

// get with query param : email
// return : { status, message}
export const resetPassword = async (email) => {
    try {
        const response = await axios.post(`${apiUrl}/auth/reset-password?email=${email}`)
        return response
    } catch (error) {
        // throw new Error(error)
        return error
    }
}