"use client"
import axios from "axios"
import type { Category } from "@/interface/category"

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

export async function get_categories(): Promise<Category[] | undefined> {
  return await reqest
    .get("/api/categories")
    .then((e) => {return e.data})
    .catch(() => undefined)
}

export async function add_category(name: string) {
  return await reqest
    .post("/api/categories", { name })
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function delete_category(id: number) {
  return await reqest
    .delete(`/api/categories/${id}`)
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function reorder_categories(categoryIds: number[]) {
  return await reqest
    .put("/api/categories/reorder", categoryIds)
    .then((e) => e.data)
    .catch(() => undefined)
}
