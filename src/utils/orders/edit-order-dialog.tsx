"use client";

import { useState, useEffect, useRef } from "react";
import type { Order } from "@/interface/Orders";
import { updateOrder } from "@/apis_reqests/cart";

interface EditOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const statuses = [
  { value: "pending", label: "Čeká" },
  { value: "processing", label: "Zpracovává se" },
  { value: "shipped", label: "Odesláno" },
  { value: "delivered", label: "Doručeno" },
  { value: "cancelled", label: "Zrušeno" },
];

export function EditOrderDialog({
  order,
  open,
  onOpenChange,
  onUpdate,
}: EditOrderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState(order?.status || "pending");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsLoading(true);
    const result = await updateOrder(order.orderId, status);
    setIsLoading(false);

    if (result) {
      onUpdate();
      onOpenChange(false);
    }
  };

  if (!order) return null;

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-md rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/50"
      onClose={() => onOpenChange(false)}
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upravit objednávku #{order.orderId}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Změňte stav objednávky a uložte změny.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
            Stav
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Zrušit
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading && (
              <svg className="mr-2 size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            Uložit
          </button>
        </div>
      </form>
    </dialog>
  );
}
