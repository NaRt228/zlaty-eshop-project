"use client"
import axios from "axios"
import type { Product_cart } from "@/interface/product_cart"
import type { responde_cart } from "@/interface/product_response"
import { Order } from "@/interface/Orders"

const reqest = axios.create({
  baseURL: "https://aspgoldeshop-production.up.railway.app/",
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
    .catch(() => undefined)
}

export async function add_to_cart(productId: number, quantity: number): Promise<responde_cart | undefined> {
  return await reqest
    .post("/api/cart/add", { productId, quantity })
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function update_cart_item(productId: number, quantity: number) {
  return await reqest
    .put("/api/cart/update", { productId, quantity })
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function remove_from_cart(productId: number) {
  return await reqest
    .delete("/api/cart/remove", { data: { productId } })
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function clear_cart(): Promise<string | null> {
  return await reqest
    .delete("/api/cart/clear")
    .then((e) => { return "ok"})
    .catch((e) => { return null})
}
export async function getAllOrders(): Promise<Order[] | undefined> {
  return await reqest
    .get("/api/orders")
    .then((res) => res.data.orders)
    .catch(() => undefined);
}

export async function updateOrder(
  orderId: number,
  status?: string,
  total_amount?: number
): Promise<Order | undefined> {
  return await reqest
    .put(`/api/orders/${orderId}`, { status, total_amount })
    .then((res) => res.data.order)
    .catch(() => undefined);
}

export async function deleteOrder(orderId: number): Promise<string | undefined> {
  return await reqest
    .delete(`/api/orders/${orderId}`)
    .then((res) => res.data.message)
    .catch(() => undefined);
}
