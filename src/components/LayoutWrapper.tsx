"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, Tag, Menu, X, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

// Admin Sidebar Component
function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
          className="font-playfair bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-black transition-transform md:translate-x-0 font-sans",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-b border-gray-700 px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
            <Package className="h-6 w-6" />
            <span>Zlatý E-shop</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                pathname === "/admin" ? "bg-gray-800 text-white" : "",
              )}
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/kategorie"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                pathname === "/admin/kategorie" ? "bg-gray-800 text-white" : "",
              )}
              onClick={() => setIsOpen(false)}
            >
              <Tag className="h-5 w-5" />
              Kategorie
            </Link>
            <Link
              href="/admin/produkty"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                pathname.startsWith("/admin/produkty") ? "bg-gray-800 text-white" : "",
              )}
              onClick={() => setIsOpen(false)}
            >
              <Package className="h-5 w-5" />
              Produkty
            </Link>
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}

// Admin Header Component
function AdminHeader() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 md:px-6 font-playfair">
      <div className="flex flex-1 items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-700 hover:bg-gray-100">
              <User className="h-5 w-5" />
              <span className="sr-only">Uživatelské menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-playfair">
            <DropdownMenuLabel>Můj účet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Odhlásit se
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

// Admin Footer Component
// function AdminFooter() {
//   return (
//     <footer className="border-t border-gray-200 py-6 md:py-0 font-playfair bg-white">
//       <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
//         <p className="text-center text-sm leading-loose text-gray-600 md:text-left">
//           &copy; {new Date().getFullYear()} Zlatý E-shop - Administrace. Všechna práva vyhrazena.
//         </p>
//       </div>
//     </footer>
//   )
// }

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if we're on admin pages
  const isAdminPage = pathname.startsWith("/admin")
  const isLoginPage = pathname === "/login" || pathname === "/register"

  // Admin Layout - only for /admin pages
  if (isAdminPage) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-gray-50">
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="flex flex-col flex-1 md:ml-64">
            <AdminHeader />
            <main className="flex-grow bg-gray-50 p-4 md:p-6 text-gray-900">{children}</main>

          </div>
        </div>
      </div>
    )
  }

  // Main Layout - for everything else (including login/register)
  return (
    <div className="flex flex-col min-h-screen font-playfair">
      {!isLoginPage && <Header />}
      <main className="flex-grow bg-black">{children}</main>
      {!isLoginPage && <Footer />}
    </div>
  )
}
