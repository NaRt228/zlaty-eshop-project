"use client"
import axios from "axios";
import Cookies from "js-cookie";
const reqest = axios.create({
    baseURL: "https://apigolde-shop-production-5431.up.railway.app/",
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${typeof window !== "undefined" && localStorage.getItem('jwtToken')}`,
        "Content-Type": "application/json",
      },
});

reqest.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export async function login(email: string, password: string) {
    try {
        const response = await reqest.post("/api/auth/login", { email, password });
        const token = response.data.token;

        if (token) {
            localStorage.setItem("jwtToken", token);
            Cookies.set("jwtToken", token); // <-- uložení do cookies
            console.log("Login successful.");
        }
        return response
    } catch{
        
    }
}


export async function logout() {
    try {
        await reqest.post("/api/auth/logout");

        // Smazat token z localStorage
        localStorage.removeItem("jwtToken");

        // Smazat všechny cookies (client-side způsob)
        document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });

        // Přesměrování na homepage
        window.location.href = "/";
    } catch (error) {
        console.error("Logout failed:", error);
       
    }
}

export async function isAdmin() {
    reqest.get("/api/auth/isAdmin").then((e)=>e.data)
}