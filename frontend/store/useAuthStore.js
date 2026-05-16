import { create } from 'zustand'
import { axiosInstance } from '../utils/axios.js'
import toast from 'react-hot-toast';



export const useAuthStore = create((set) => ({
    user: null,
    isLoggingIn: false,
    isAuthenticated: false,
    loginUser: null,

    addEmployee : async (formData) =>{
        try {
            const { data } = await axiosInstance.post('/user/register', formData)
            toast.success(data.message || "Employee Added.")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to Add Employee.")
        }
    },

    login: async (formData) => {
        set({ isLoggingIn: true })
        try {
            const { data } = await axiosInstance.post("/user/login", formData)
            toast.success(data.message || "Login successfull.")
            set({
                loginUser: data.user,
            });
            return data.user;

        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed")
        } finally {
            set({ isLoggingIn: false })
        }
    },

    me: async () =>{
        set({ isLoading: true })
        try {
            const { data } = await axiosInstance.get('/user/me')
            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetched user.")
        } finally {
            set({ isLoading: false })
        }
    },

    logout: async () => {
        set({ isLoading: true })
        try {
            const { data } = await axiosInstance.get('/user/logout')
            toast.success(data.message || "Logged Out.")
            set({
                user: null,
                isAuthenticated: false,
                isLoading: true,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to logout.")
        } finally{
            set({ isLoading: false })
        }
    }
}))
