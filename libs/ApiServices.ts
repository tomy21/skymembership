import axios from "axios";

export const APISERVICES = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_PAYMENT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const APIAPPS = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_USERS,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
