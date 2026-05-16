import { create } from 'zustand'
import { axiosInstance } from '../utils/axios.js'
import toast from 'react-hot-toast';



export const useAdminStore = create((set)=>({

    stores: null,

    getAllStores: async() =>{
        try {
            const { data } = await axiosInstance.get('/admin/get-all-stores')
            set({stores: data})
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to Fetch Stores.")
        }
    }


}))