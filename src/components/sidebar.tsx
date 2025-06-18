"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, Tag, ShoppingCart, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAuthenticated && pathname !== "/login" && pathname !== "/register") {
    return null
  }

  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="border-b px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>Zlatý E-shop</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/" ? "bg-accent text-accent-foreground" : "transparent",
              )}
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/kategorie"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/kategorie" ? "bg-accent text-accent-foreground" : "transparent",
              )}
              onClick={() => setIsOpen(false)}
            >
              <Tag className="h-5 w-5" />
              Kategorie
            </Link>
            <Link
              href="/produkty"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/produkty") ? "bg-accent text-accent-foreground" : "transparent",
              )}
              onClick={() => setIsOpen(false)}
            >
              <Package className="h-5 w-5" />
              Produkty
            </Link>
            <Link
              href="/kosik"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/kosik" ? "bg-accent text-accent-foreground" : "transparent",
              )}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Košík
            </Link>
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}
