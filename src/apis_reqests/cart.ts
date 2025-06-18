"use client"
import axios from "axios"
import type { Product_cart } from "@/interface/product_cart"
import type { responde_cart } from "@/interface/product_response"

const reqest = axios.create({
  baseURL: "https://apigolde-shop-production-5431.up.railway.app/",
  headers: {
        Authorization: `Bearer ${typeof window !== "undefined" && localStorage.getItem('jwtToken')}`,
        "Content-Type": "application/json",
      },
  withCredentials: true,
})

export async function get_cart(): Promise<Product_cart[] | undefined> {
  return await reqest
    .get("/api/cart")
    .then((e) => e.data)
    .catch((e) => undefined)
}

export async function add_to_cart(productId: number, quantity: number): Promise<responde_cart | undefined> {
  return await reqest
    .post("/api/cart/add", { productId, quantity })
    .then((e) => e.data)
    .catch((e) => undefined)
}

export async function update_cart_item(productId: number, quantity: number) {
  return await reqest
    .put("/api/cart/update", { productId, quantity })
    .then((e) => e.data)
    .catch((e) => undefined)
}

export async function remove_from_cart(productId: number) {
  return await reqest
    .delete("/api/cart/remove", { data: { productId } })
    .then((e) => e.data)
    .catch((e) => undefined)
}

export async function clear_cart(): Promise<string | null> {
  return await reqest
    .delete("/api/cart/clear")
    .then((e) => {alert(e.data.message); return "ok"})
    .catch((e) => {alert(e.response.data); return null})
}
