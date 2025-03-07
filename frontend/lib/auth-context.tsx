'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { userService, User } from '@/lib/api/user-service'
import { jwtDecode } from 'jwt-decode'

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token')

                if (token) {
                    // Decode JWT to get user email
                    try {
                        const decoded = jwtDecode(token) as { sub: string };
                        if (decoded.sub) {
                            const userData = await userService.getProfile(decoded.sub);
                            setUser(userData);
                        }
                    } catch (error) {
                        console.error('Failed to decode token:', error);
                        localStorage.removeItem('token');
                    }
                }
            } catch (error) {
                console.error('Authentication error:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)
            await userService.login({ email, password });
            const userData = await userService.getProfile(email);
            setUser(userData);
        } catch (error) {
            console.error('Login error:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const register = async (username: string, email: string, password: string) => {
        try {
            setLoading(true)
            await userService.register({ username, email, password });
            // Automatically log in after registration
            await login(email, password);
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        userService.logout();
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}