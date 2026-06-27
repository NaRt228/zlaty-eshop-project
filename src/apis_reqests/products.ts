"use client"
import type { Get_Once_Product, Product_cart } from "@/interface/product_cart"
import type { product_curt_post_Interface, responde_cart } from "../interface/product_response"
import axios from "axios"
import { Order } from "@/interface/oreders"

const reqest = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://golde-shop-production.up.railway.app/",
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

export async function post_product(values: product_curt_post_Interface): Promise<responde_cart | undefined> {
  return await reqest
    .post("/api/cart/add", values)
    .then((e) => e.data)
    .catch((e) => e?.response?.data ?? undefined)
}

export async function get_products_cart(): Promise<Product_cart[] | undefined> {
  return await reqest
    .get("/api/cart")
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function put_products_cart(value: product_curt_post_Interface) {
  return await reqest
    .put("/api/cart/update", value)
    .then((e) => console.log("put_products_cart response: " + e.data))
    .catch(() => console.log("put_products_cart response: " + undefined))
}

export async function delete_products_cart(value: { productId: number }) {
  return await reqest
    .delete("/api/cart/remove", { data: value })
    .then((e) => console.log("delete_products_cart response: " + e.data))
    .catch(() => console.log("delete_products_cart response: " + undefined))
}

export async function get_products(page = 1, limit = 10) {
  return await reqest
    .get(`/api/products?page=${page}&limit=${limit}`)
    .then((e) => e.data)
    .catch((e) => e)
}

export async function get_product(id: number) {
  return await reqest
    .get(`/api/products/${id}`)
    .then((e) => e.data)
    .catch((e) => e)
}


export async function get_product_by_id(id: string): Promise<Get_Once_Product | undefined> {
  return await reqest.get(`/api/products/${id}`, ).then(e => e.data).catch(() => undefined)
}
export async function add_product(productData: any, mediaFiles: File[]) {
  try {
    const formData = new FormData()

    // Append product data
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key])
    })

    // Append media files
    mediaFiles.forEach((file) => {
      formData.append("media", file)
    })

    const response = await reqest.post("/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.status
  } catch {
    return undefined
  }
}

export async function update_product(id: number, productData: any, mediaFiles: File[]) {
  try {
    const formData = new FormData()

    // Append product data
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key])
    })

    // Append media files
    mediaFiles.forEach((file) => {
      formData.append("media", file)
    })

    const response = await reqest.put(`/api/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch {
    return undefined
  }
}

export async function delete_product(id: number) {
  return await reqest
    .delete(`/api/products/${id}`)
    .then((e) => e.data)
    .catch(() => undefined)
}

export async function delete_product_media(productId: number, mediaUrl: string) {
  try {
    const response = await reqest.delete(`/api/products/${productId}/media`, {
      params: { mediaUrl }
    })
    return response.data
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Nepodařilo se smazat obrázek")
  }
}

export async function make_order(order: Order): Promise<string | null> {
  console.log("123456789");
  const g = await reqest
    .post(`/api/orders`, order)
    .then(() => { return "ok"})
    .catch((e) => {
      const errMsg = e.response?.data?.error || e.response?.data?.message || "Nepodařilo se odeslat objednávku";
      alert(errMsg);
      return null;
    });
  return g;
}