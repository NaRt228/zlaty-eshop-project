"use client";

import { useState, useEffect, useRef } from "react";
import type { Order } from "@/interface/Orders";
import { deleteOrder } from "@/apis_reqests/cart";

interface DeleteOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function DeleteOrderDialog({
  order,
  open,
  onOpenChange,
  onUpdate,
}: DeleteOrderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const handleDelete = async () => {
    if (!order) return;

    setIsLoading(true);
    const result = await deleteOrder(order.orderId);
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
      <div className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
              <svg className="size-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Odstranit objednávku
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Opravdu chcete odstranit objednávku #{order.orderId}? Tuto akci nelze vrátit zpět.
              </p>
            </div>
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

        <div className="flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Zrušit
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading && (
              <svg className="mr-2 size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            Odstranit
          </button>
        </div>
      </div>
    </dialog>
  );
}
