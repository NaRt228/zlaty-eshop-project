"use client"
import axios from "axios"
import type { Product_cart } from "@/interface/product_cart"
import type { responde_cart } from "@/interface/product_response"
import { Order } from "@/interface/Orders"

const reqest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://aspgoldeshop-production.up.railway.app/",
  headers: {
        "Content-Type": "application/json",
      },
  withCredentials: true,
})

// Get or create a persistent guest session ID stored in localStorage
function getOrCreateGuestSessionId(): string | null {
  if (typeof window === "undefined") return null;
  let sessionId = localStorage.getItem("guest_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("guest_session_id", sessionId);
  }
  return sessionId;
}

reqest.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // For guest users: send session ID in header (cookies don't work cross-origin on localhost)
        const sessionId = getOrCreateGuestSessionId();
        if (sessionId) {
          config.headers["X-Guest-Session-Id"] = sessionId;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    .then(() => { return "ok"})
    .catch(() => { return null})
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
