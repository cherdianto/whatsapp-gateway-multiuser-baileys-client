import { useUser } from '../context/user.context'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { fetchUser } from '../apiQuery/user.query.js'

const useAuth = ({ redirect }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    // const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const { user, setUser } = useUser()
    const navigate = useNavigate()

    const getUser = async () => {
        setIsLoading(true)
        console.log('useAuth get user')
        try {
            const res = await fetchUser(user?.accessToken)
            console.log(res)
            setCurrentUser(res)
            setIsError(false)
            setUser(res)
            setIsLoading(false)
        } catch (error) {
            console.log('error get user')
            console.log(error)
            setUser()
            setIsError(true)
            setCurrentUser(null)
            setIsLoading(false)
            // if (redirect !== null) {
            //     navigate(`/${redirect}`)
            // }
        }
    }

    useEffect(() => {
        console.log('use effect useAuth')
        if (!user) getUser()
    }, [user])

    return {currentUser, isLoading, isError}
}

export default useAuth