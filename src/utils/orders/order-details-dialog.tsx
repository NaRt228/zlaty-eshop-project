"use client";

import { useEffect, useRef } from "react";
import type { Order } from "@/interface/Orders";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Čeká",
  processing: "Zpracovává se",
  shipped: "Odesláno",
  delivered: "Doručeno",
  cancelled: "Zrušeno",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
  }).format(price);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  if (!order) return null;

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-2xl rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/50"
      onClose={() => onOpenChange(false)}
    >
      <div className="max-h-[90vh] overflow-y-auto p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900">
              Objednávka #{order.orderId}
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  statusColors[order.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {statusLabels[order.status] || order.status}
              </span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Vytvořeno: {formatDate(order.created_at)}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {order.guest && (
            <div>
              <h3 className="mb-3 font-semibold text-gray-900">Informace o zákazníkovi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{order.guest.name} {order.guest.surname}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{order.guest.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{order.guest.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <svg className="mt-0.5 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    {order.guest.address.country}, {order.guest.address.city},{" "}
                    {order.guest.address.street}, {order.guest.address.houseNumber}
                  </span>
                </div>
              </div>
            </div>
          )}

          <hr className="border-gray-200" />

          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Produkty</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex gap-4 rounded-lg border border-gray-200 p-3"
                >
                  {item.mediaUrls?.[0] && (
                    <img
                      src={item.mediaUrls[0]}
                      alt={item.name}
                      className="size-16 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="line-clamp-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <p className="shrink-0 font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Množství: {item.quantity}</span>
                      <span>Cena: {formatPrice(item.price)}</span>
                      {item.material && <span>Materiál: {item.material}</span>}
                      {item.weight && <span>Hmotnost: {item.weight} g</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Celková částka:</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
