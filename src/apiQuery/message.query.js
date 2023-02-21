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
        const response = await axiosJWT.get(`${apiUrl}/message/all`, config)
        console.log(response)
        return response.data.messages
    } catch (error) {
        throw new Error(error)
    }
}

export const addData = async ({accessToken, newValues}) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    }

    try {
        const response = await axiosJWT.post(`${apiUrl}/message/add`, newValues, config)
        console.log(response)
        return response
    } catch (error) {
        throw new Error(error)
    }
}

// export const deleteData = async ({accessToken, id}) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${accessToken}`
//         },
//     }

//     try {
//         const response = await axiosJWT.delete(`${apiUrl}/message/delete/${id}`, config)
//         // console.log(response)
//         // return response
//     } catch (error) {
//         throw new Error(error)
//     }
// }

// export const updateData = async ({accessToken, values}) => {
//     console.log(values)
//     const config = {
//         headers: {
//             Authorization: `Bearer ${accessToken}`
//         },
//     }

//     try {
//         const response = await axiosJWT.put(`${apiUrl}/message/update/${values.id}`, values, config)
//         console.log(response)
//         return response
//     } catch (error) {
//         throw new Error(error)
//     }
// }