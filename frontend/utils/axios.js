import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1'

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

