"use client"
import axios from "axios"
import type { Category } from "@/interface/category"

const reqest = axios.create({
  baseURL: "https://aspgoldeshop-production.up.railway.app/",
  headers: {
        Authorization: `Bearer ${typeof window !== "undefined" && localStorage.getItem('jwtToken')}`,
        "Content-Type": "application/json",
      },
  withCredentials: true,
})

export async function get_categories(): Promise<Category[] | undefined> {
  return await reqest
    .get("/api/categories")
    .then((e) => {console.log(e.data);return e.data})
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
