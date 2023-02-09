import { useUser } from '../context/user.context'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { fetchUser } from '../apiQuery/user.query.js'

const useAuthNew = ({ redirect }) => {
    const [currentUser, setCurrentUser] = useState(null)
    // const [loading, setLoading] = useState(false)
    const { user, setUser } = useUser()
    const { push } = useNavigate()

    const getUser = async () => {
        // setLoading(true)
        console.log('useAuthNew get user')
        try {
            const res = await fetchUser(user?.accessToken)
            setCurrentUser(res)
            setUser(res)
        } catch (error) {
            setUser()
            setCurrentUser(null)
            if (redirect !== null) {
                push(`/${redirect}`)
            }
        }
        // setLoading(false)
    }

    useEffect(() => {
        if (!user) getUser()
    }, [])

    // if (loading) {
    //     return <>
    //         <h2>loading...</h2>
    //     </>
    // }

    return currentUser
}

export default useAuthNew