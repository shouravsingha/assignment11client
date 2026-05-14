import { createContext, useState, useEffect } from 'react'
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth'
import { auth } from '../config/firebase.config'
import axiosInstance from '../utils/axiosInstance'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [mongoUser, setMongoUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        setLoading(true)
        setMongoUser(null)
        return firebaseSignOut(auth)
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        })
    }

    const fetchMongoUser = async (email) => {
        try {
            const response = await axiosInstance.post('/auth/login', { email })
            if (response.data.success) {
                setMongoUser(response.data.user)
            }
        } catch (error) {
            console.error('Error fetching MongoDB user:', error)
            setMongoUser(null)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)
            if (currentUser) {
                await fetchMongoUser(currentUser.email)
            } else {
                setMongoUser(null)
            }
            setLoading(false)
        })
        return () => {
            return unsubscribe()
        }
    }, [])

    const value = {
        user,
        mongoUser,
        setMongoUser,
        loading,
        createUser,
        signIn,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
        role: mongoUser?.role
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
