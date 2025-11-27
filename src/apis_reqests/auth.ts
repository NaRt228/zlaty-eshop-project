"use client"
import axios from "axios"
import type { AuthResponse } from "@/interface/auth"

const reqest = axios.create({
  baseURL: "https://aspgoldeshop-production.up.railway.app/",
  headers: {
        Authorization: `Bearer ${typeof window !== "undefined" && localStorage.getItem('jwtToken')}`,
        "Content-Type": "application/json",
      },
  withCredentials: true,
})

export async function register_admin(
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse | undefined> {
  return await reqest
    .post("/api/auth/register", { username, email, password })
    .then((e) => e.data)
    .catch(() => undefined)
}
//

export async function login(email: string, password: string): Promise<AuthResponse | undefined> {
  return await reqest
    .post("/api/auth/login", { email, password })
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function logout() {
  return await reqest
    .post("/api/auth/logout")
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function is_admin() {
  return await reqest
    .get("/api/auth/isAdmin")
    .then((e) => e.data)
    .catch(() => ({ isAdmin: false }))
}
