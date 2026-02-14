import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/v1";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            window.dispatchEvent(new Event("force-logout"));
        }
        return Promise.reject(error);
    }
);

const getData = async<T>(url: string) => {
    return api.get(url).then((response) => response.data);
}

const postData = async<T>(url: string, data: unknown) => {
    return api.post(url, data).then((response) => response.data);
}

const putData = async<T>(url: string, data: unknown) => {
    return api.put(url, data).then((response) => response.data);
}

const deleteData = async<T>(url: string) => {
    return api.delete(url).then((response) => response.data);
}

const publicRoutes = ["/sign-in", "/sign-up", "/verify-email", "/forgot-password", "/reset-password", "/"];

// Aliases for compatibility
const fetchData = getData;
const updateData = putData;

export { postData, getData, putData, deleteData, api, publicRoutes, fetchData, updateData };

