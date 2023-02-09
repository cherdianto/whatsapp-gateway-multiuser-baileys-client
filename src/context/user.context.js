import { createContext, useContext, useState } from "react";

export const UserContextImpl = createContext(null)

export function useUser() {
    return useContext(UserContextImpl)
}

export const UserProvider = ({ children, initialUser }) => {
    const [user, setUser] = useState(initialUser)

    return <UserContextImpl.Provider value={{ user, setUser}}>
        {children}
    </UserContextImpl.Provider>
}