import axios from 'axios';
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 120_000,
});
