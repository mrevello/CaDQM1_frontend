import axios from "axios"

// To do: change this
const BASE_URL = "http://localhost:8000/api/"

export const instance = axios.create({
    baseURL: BASE_URL
})

