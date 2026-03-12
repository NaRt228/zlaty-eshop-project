"use client";

import { useEffect, useState, useCallback } from "react";
import type { Order } from "@/interface/Orders";
import { getAllOrders } from "@/apis_reqests/cart";
import { OrdersTable } from "@/utils/orders/orders-table";

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 sm:text-sm">{title}</span>
        <span className="text-gray-400">{icon}</span>
      </div>
      <div className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">{value}</div>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
  }).format(price);
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200" />
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const data = await getAllOrders();
    setOrders(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Objednávky
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Správa objednávek vašeho obchodu
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
          >
            <svg
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Obnovit
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <LoadingSkeleton />
                </div>
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="Celkem objednávek"
                value={orders.length}
                icon={
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
                description="Celkový počet"
              />
              <StatCard
                title="Tržby"
                value={formatPrice(totalRevenue)}
                icon={
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                description="Celková částka"
              />
              <StatCard
                title="Čekající"
                value={pendingOrders}
                icon={
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                description="Nové objednávky"
              />
              <StatCard
                title="Produktů"
                value={totalItems}
                icon={
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
                description="Ve všech objednávkách"
              />
            </>
          )}
        </div>

        {/* Orders Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Seznam objednávek</h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Prohlížejte, upravujte a odstraňujte objednávky
            </p>
          </div>
          <div className="p-3 sm:p-6">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-10 flex-1 animate-pulse rounded bg-gray-200" />
                    <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center">
                <svg className="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Zatím žádné objednávky</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Nové objednávky se zde objeví po jejich vytvoření.
                </p>
              </div>
            ) : (
              <OrdersTable orders={orders} onUpdate={fetchOrders} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
