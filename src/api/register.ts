import axios from "axios";
import { instance } from "./base.api"

const endpoint = "register/"

export const register = {
    register: async function (username: string, password: string, email: string, description: string) {
        try {
            const response = await instance.post(endpoint, {
                username: username,
                password: password,
                email: email,
                description: description,
            });

            const { message } = response.data;

            return message;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.data && error.response.data.error) {
                        throw new Error(error.response.data.error);
                    }
                } else if (error.request) {
                    throw new Error("No response received from server. Please check your network connection.");
                } else {
                    throw new Error("An unexpected error occurred. Please try again.");
                }
            } else {
                throw new Error("An unexpected error occurred. Please try again.");
            }
        }
    },
};