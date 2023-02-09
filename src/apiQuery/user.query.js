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

export const fetchUser = async (accessToken) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.get(`${apiUrl}/auth/user`, config)
        return response.data.user
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