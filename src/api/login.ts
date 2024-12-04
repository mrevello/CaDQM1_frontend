import { instance } from "./base.api"

const endpoint = "login/"

export const login = {
    login: async function (username: string, password: string) {
        try {
            const response = await instance.post(endpoint, {
                username: username,
                password: password
            })

            const { refresh, access } = response.data

            console.log("Access Token:", access)

            return access
        } catch (error) {
            console.error("Login failed:", error)
            throw error
        }
    }
}