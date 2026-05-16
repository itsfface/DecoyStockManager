import { create } from "zustand";
import { axiosInstance } from '../utils/axios.js'
import toast from "react-hot-toast";

export const useStoreStore = create((set)=>({
    
    addStore: async (storeData )=>{
        try {
            const { data } = await axiosInstance.post('/store/create-store',storeData)
            toast.success(data.message || "Store Created.")
        } catch (error) {
            toast.error(error.message || "Failed to create Store.")
        }
    }
}))