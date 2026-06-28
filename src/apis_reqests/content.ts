"use client"
import axios from "axios"

const reqest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://golde-shop-production.up.railway.app/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

reqest.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

reqest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("jwtToken");
        document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (window.location.pathname.startsWith("/admin")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export async function get_content(): Promise<any> {
  return await reqest
    .get("/api/content")
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function update_content(newContent: any): Promise<any> {
  return await reqest
    .post("/api/content", newContent)
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function upload_content_image(file: File): Promise<string | undefined> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    
    const response = await reqest.post("/api/content/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data?.url
  } catch {
    return undefined
  }
}
