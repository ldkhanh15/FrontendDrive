import { useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        email: "",
        name: "",
        role:""
    }
})
export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            email: "",
            name: "",
            role:""
        }
    })
    const [appLoading, setAppLoading] = useState(false)
    return (
        <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
            {props.children}
        </AuthContext.Provider>
    )
}
