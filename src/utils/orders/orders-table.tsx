"use client";

import { useState } from "react";
import type { Order } from "@/interface/Orders";
import { OrderDetailsDialog } from "./order-details-dialog";
import { EditOrderDialog } from "./edit-order-dialog";
import { DeleteOrderDialog } from "./delete-order-dialog";

interface OrdersTableProps {
  orders: Order[];
  onUpdate: () => void;
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
  }).format(price);
}

function ActionButtons({
  order,
  onView,
  onEdit,
  onDelete,
}: {
  order: Order;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onView(order)}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label="Zobrazit objednávku"
      >
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      <button
        onClick={() => onEdit(order)}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label="Upravit objednávku"
      >
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={() => onDelete(order)}
        className="rounded-md p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
        aria-label="Odstranit objednávku"
      >
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

export function OrdersTable({ orders, onUpdate }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">#{order.orderId}</span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[order.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {order.guest
                    ? `${order.guest.name} ${order.guest.surname}`
                    : "—"}
                </p>
              </div>
              <ActionButtons
                order={order}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="truncate text-gray-900">{order.guest?.email || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500">Telefon:</span>
                <p className="text-gray-900">{order.guest?.phone || "—"}</p>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(order.total_amount)}
              </span>
              <span className="text-xs text-gray-500">{formatDate(order.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Zákazník</th>
              <th className="hidden px-4 py-3 text-left font-medium text-gray-600 lg:table-cell">Email</th>
              <th className="hidden px-4 py-3 text-left font-medium text-gray-600 xl:table-cell">Telefon</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Částka</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Stav</th>
              <th className="hidden px-4 py-3 text-left font-medium text-gray-600 lg:table-cell">Datum</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Akce</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">#{order.orderId}</td>
                <td className="px-4 py-3">
                  {order.guest
                    ? `${order.guest.name} ${order.guest.surname}`
                    : "—"}
                </td>
                <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">{order.guest?.email || "—"}</td>
                <td className="hidden px-4 py-3 text-gray-600 xl:table-cell">{order.guest?.phone || "—"}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(order.total_amount)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[order.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <ActionButtons
                      order={order}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditOrderDialog
        order={selectedOrder}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={onUpdate}
      />

      <DeleteOrderDialog
        order={selectedOrder}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onUpdate={onUpdate}
      />
    </>
  );
}
