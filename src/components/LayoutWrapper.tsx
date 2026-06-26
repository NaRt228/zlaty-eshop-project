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
import {  Package, Tag, Menu, X, LogOut, User, Gem } from "lucide-react"
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
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <Package className="h-6 w-6" />
            <span>Zlatý E-shop</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
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
              href="/admin/material"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                pathname === "/admin/material" ? "bg-gray-800 text-white" : "",
              )}
              onClick={() => setIsOpen(false)}
            >
              <Gem className="h-5 w-5" />
              Materiál
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
             <Link
              href="/admin/orders"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                pathname.startsWith("/admin/orders") ? "bg-gray-800 text-white" : "",
              )}
              onClick={() => setIsOpen(false)}
            >
              <Tag className="h-5 w-5" />
              Objednávky
            </Link>
            <Link
              href="/admin/obsah"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                pathname === "/admin/obsah" ? "bg-gray-800 text-white" : "",
              )}
              onClick={() => setIsOpen(false)}
            >
              <Package className="h-5 w-5" />
              Správa obsahu
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
      <div className="flex flex-col min-h-screen font-sans bg-black text-white admin-theme">
        <style dangerouslySetInnerHTML={{ __html: `
          /* ─── Base ─── */
          .admin-theme {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
          .admin-theme aside {
            background-color: #000000 !important;
            border-right: 1px solid #222 !important;
          }
          .admin-theme header {
            background-color: #000000 !important;
            border-bottom: 1px solid #222 !important;
            color: #ffffff !important;
          }
          .admin-theme main {
            background-color: #000000 !important;
            color: #ffffff !important;
          }

          /* ─── All text white by default ─── */
          .admin-theme *:not(svg):not(path):not(circle):not(rect):not(line):not(polyline):not(polygon) {
            color: inherit;
          }
          .admin-theme p,
          .admin-theme span,
          .admin-theme label,
          .admin-theme li,
          .admin-theme a,
          .admin-theme small,
          .admin-theme div {
            color: #ffffff;
          }

          /* ─── Headings ─── */
          .admin-theme h1,
          .admin-theme h2,
          .admin-theme h3,
          .admin-theme h4,
          .admin-theme h5,
          .admin-theme h6 {
            color: #ffffff !important;
          }

          /* ─── Muted / description text ─── */
          .admin-theme .text-muted-foreground,
          .admin-theme .text-muted,
          .admin-theme [class*="CardDescription"],
          .admin-theme .text-gray-500,
          .admin-theme .text-gray-400,
          .admin-theme .text-gray-600,
          .admin-theme .text-gray-700,
          .admin-theme .text-gray-900,
          .admin-theme .text-sm.text-muted-foreground {
            color: #a3a3a3 !important;
          }

          /* ─── Cards ─── */
          .admin-theme .bg-card,
          .admin-theme .bg-white,
          .admin-theme .bg-gray-50,
          .admin-theme .bg-background,
          .admin-theme [class*="Card"] {
            background-color: #0a0a0a !important;
            color: #ffffff !important;
            border-color: #222 !important;
          }

          /* ─── Borders ─── */
          .admin-theme .border,
          .admin-theme [class*="border-"] {
            border-color: #222 !important;
          }

          /* ─── Rounded corners → sharp ─── */
          .admin-theme .rounded-lg,
          .admin-theme .rounded-md,
          .admin-theme .rounded-sm,
          .admin-theme .rounded,
          .admin-theme .rounded-full,
          .admin-theme button,
          .admin-theme input,
          .admin-theme textarea,
          .admin-theme select {
            border-radius: 0px !important;
          }

          /* ─── Inputs / Textareas / Selects ─── */
          .admin-theme input,
          .admin-theme textarea,
          .admin-theme select {
            background-color: #0d0d0d !important;
            border: 1px solid #333 !important;
            color: #ffffff !important;
          }
          .admin-theme input::placeholder,
          .admin-theme textarea::placeholder {
            color: #555 !important;
          }
          .admin-theme input:focus,
          .admin-theme textarea:focus,
          .admin-theme select:focus {
            border-color: #ffffff !important;
            outline: none !important;
            box-shadow: 0 0 0 1px #ffffff !important;
          }

          /* ─── Labels ─── */
          .admin-theme label {
            color: #e5e5e5 !important;
            font-weight: 500;
          }

          /* ─── Table ─── */
          .admin-theme table {
            border-color: #222 !important;
          }
          .admin-theme th {
            color: #a3a3a3 !important;
            border-color: #222 !important;
            background-color: #050505 !important;
          }
          .admin-theme td {
            color: #ffffff !important;
            border-color: #1a1a1a !important;
          }
          .admin-theme tbody tr:hover {
            background-color: #111 !important;
          }

          /* ─── Buttons ─── */
          .admin-theme button:not([class*="text-red"]):not([class*="ghost"]):not([data-variant="ghost"]):not([role="combobox"]):not([aria-haspopup="listbox"]):not([aria-haspopup="true"]) {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #ffffff !important;
          }
          .admin-theme button:not([class*="text-red"]):not([class*="ghost"]):not([data-variant="ghost"]):not([role="combobox"]):not([aria-haspopup="listbox"]):not([aria-haspopup="true"]):hover {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
          .admin-theme button[class*="ghost"],
          .admin-theme button[data-variant="ghost"] {
            background-color: transparent !important;
            border: none !important;
            color: #a3a3a3 !important;
          }
          .admin-theme button[class*="ghost"]:hover,
          .admin-theme button[data-variant="ghost"]:hover {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
          }
          .admin-theme .text-red-600,
          .admin-theme [class*="text-red"] {
            color: #ef4444 !important;
          }
          .admin-theme .hover\\:bg-red-50:hover {
            background-color: #1a0f0f !important;
          }

          /* ─── Dialog / Modal ─── */
          .admin-theme [role="dialog"],
          .admin-theme [data-radix-popper-content-wrapper] > div {
            background-color: #0a0a0a !important;
            border: 1px solid #333 !important;
            color: #ffffff !important;
          }
          .admin-theme [role="dialog"] h2,
          .admin-theme [role="dialog"] h3,
          .admin-theme [role="dialog"] p,
          .admin-theme [role="dialog"] label,
          .admin-theme [role="dialog"] span {
            color: #ffffff !important;
          }
          .admin-theme [role="dialog"] .text-muted-foreground {
            color: #a3a3a3 !important;
          }

          /* ─── Dropdown / Popover / Select content ─── */
          .admin-theme [role="listbox"],
          .admin-theme [role="menu"],
          .admin-theme [data-radix-select-content],
          .admin-theme [data-radix-popper-content-wrapper] {
            background-color: #0a0a0a !important;
            border: 1px solid #333 !important;
            color: #ffffff !important;
          }
          .admin-theme [role="option"],
          .admin-theme [role="menuitem"] {
            color: #ffffff !important;
          }
          .admin-theme [role="option"]:hover,
          .admin-theme [role="menuitem"]:hover,
          .admin-theme [role="option"][data-highlighted],
          .admin-theme [role="option"][data-state="checked"] {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
          }

          /* ─── Alert ─── */
          .admin-theme [role="alert"] {
            border-color: #333 !important;
            color: #ffffff !important;
          }
          .admin-theme [role="alert"].destructive,
          .admin-theme .alert-destructive {
            border-color: #7f1d1d !important;
            background-color: #1a0a0a !important;
            color: #fca5a5 !important;
          }

          /* ─── Pagination ─── */
          .admin-theme nav[aria-label] button,
          .admin-theme nav[aria-label] a {
            background-color: transparent !important;
            color: #a3a3a3 !important;
            border-color: #333 !important;
          }
          .admin-theme nav[aria-label] button:hover,
          .admin-theme nav[aria-label] a:hover {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
          }
          .admin-theme nav[aria-label] [aria-current="page"] {
            background-color: #ffffff !important;
            color: #000000 !important;
          }

          /* ─── Sidebar nav links ─── */
          .admin-theme aside a {
            color: #a3a3a3 !important;
          }
          .admin-theme aside a:hover {
            color: #ffffff !important;
            background-color: #111 !important;
          }
          .admin-theme aside a.bg-gray-800 {
            color: #ffffff !important;
          }

          /* ─── Toast ─── */
          .admin-theme [data-radix-toast-viewport] > li,
          .admin-theme [role="status"] {
            background-color: #111 !important;
            border: 1px solid #333 !important;
            color: #ffffff !important;
          }

          /* ─── ScrollArea ─── */
          .admin-theme [data-radix-scroll-area-viewport] {
            background-color: transparent !important;
          }

          /* ─── Image placeholder ─── */
          .admin-theme .bg-gray-200 {
            background-color: #1a1a1a !important;
            color: #666 !important;
          }

          /* ─── Select Trigger (combobox button) ─── */
          .admin-theme [role="combobox"],
          .admin-theme button[aria-haspopup="listbox"],
          .admin-theme button[aria-haspopup="true"],
          .admin-theme button[aria-expanded="false"],
          .admin-theme button[aria-expanded="true"] {
            background-color: #0d0d0d !important;
            color: #ffffff !important;
            border: 1px solid #333 !important;
          }
          .admin-theme [role="combobox"]:hover,
          .admin-theme button[aria-haspopup="listbox"]:hover {
            background-color: #111 !important;
            border-color: #555 !important;
          }
          /* All text inside Select trigger → white */
          .admin-theme [role="combobox"] *,
          .admin-theme [role="combobox"] span,
          .admin-theme [role="combobox"] > span,
          .admin-theme [role="combobox"] > span > span,
          .admin-theme button[aria-haspopup="listbox"] span,
          .admin-theme button[aria-haspopup="listbox"] * {
            color: #ffffff !important;
          }
          .admin-theme [role="combobox"] svg,
          .admin-theme button[aria-haspopup="listbox"] svg {
            color: #a3a3a3 !important;
            opacity: 1 !important;
          }

          /* ─── Dialog inputs / any input inside a portal ─── */
          .admin-theme [role="dialog"] input,
          .admin-theme [role="dialog"] textarea,
          .admin-theme [role="dialog"] select,
          .admin-theme [role="dialog"] [role="combobox"] {
            background-color: #0d0d0d !important;
            color: #ffffff !important;
            border: 1px solid #333 !important;
          }
          .admin-theme [role="dialog"] input::placeholder,
          .admin-theme [role="dialog"] textarea::placeholder {
            color: #555 !important;
          }
          .admin-theme [role="dialog"] input:focus,
          .admin-theme [role="dialog"] textarea:focus {
            border-color: #ffffff !important;
            box-shadow: 0 0 0 1px #ffffff !important;
          }

          /* ─── Radix Portals outside admin-theme (dialogs/popovers/selects) ─── */
          [data-radix-portal] [role="dialog"],
          [data-radix-portal] [role="alertdialog"] {
            background-color: #0a0a0a !important;
            border: 1px solid #333 !important;
            color: #ffffff !important;
          }
          [data-radix-portal] [role="dialog"] *,
          [data-radix-portal] [role="alertdialog"] * {
            color: #ffffff;
          }
          [data-radix-portal] [role="dialog"] .text-muted-foreground,
          [data-radix-portal] [role="alertdialog"] .text-muted-foreground,
          [data-radix-portal] [role="dialog"] p:not(h1):not(h2):not(h3):not(h4),
          [data-radix-portal] [role="dialog"] small {
            color: #a3a3a3 !important;
          }
          [data-radix-portal] [role="dialog"] input,
          [data-radix-portal] [role="dialog"] textarea,
          [data-radix-portal] [role="alertdialog"] input,
          [data-radix-portal] [role="alertdialog"] textarea {
            background-color: #0d0d0d !important;
            color: #ffffff !important;
            border: 1px solid #444 !important;
            border-radius: 0 !important;
          }
          [data-radix-portal] [role="dialog"] input::placeholder,
          [data-radix-portal] [role="dialog"] textarea::placeholder {
            color: #555 !important;
          }
          [data-radix-portal] [role="dialog"] input:focus,
          [data-radix-portal] [role="dialog"] textarea:focus {
            border-color: #ffffff !important;
            outline: none !important;
            box-shadow: 0 0 0 1px #ffffff !important;
          }
          [data-radix-portal] [role="dialog"] label {
            color: #e5e5e5 !important;
          }
          [data-radix-portal] [role="dialog"] button,
          [data-radix-portal] [role="alertdialog"] button {
            border-radius: 0 !important;
          }
          [data-radix-portal] [role="dialog"] button:not([class*="text-red"]):not([class*="ghost"]):not([class*="outline"]) {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #ffffff !important;
          }
          [data-radix-portal] [role="dialog"] button:not([class*="text-red"]):not([class*="ghost"]):not([class*="outline"]):hover {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
          [data-radix-portal] [role="alertdialog"] button[class*="outline"],
          [data-radix-portal] [role="dialog"] button[class*="outline"] {
            background-color: transparent !important;
            color: #ffffff !important;
            border: 1px solid #555 !important;
          }
          [data-radix-portal] [role="alertdialog"] button[class*="outline"]:hover,
          [data-radix-portal] [role="dialog"] button[class*="outline"]:hover {
            border-color: #ffffff !important;
            background-color: #111 !important;
          }
          /* ─── Radix Portals / Dropdowns / Select Content / Menus ─── */
          body [data-radix-portal] [role="listbox"],
          body [data-radix-portal] [role="menu"],
          body [role="listbox"],
          body [role="menu"],
          body [data-radix-select-viewport],
          body [data-radix-popper-content-wrapper] {
            background-color: #000000 !important;
            border: 1px solid #333333 !important;
            border-radius: 0px !important;
          }

          body [data-radix-portal] [role="option"],
          body [data-radix-portal] [role="menuitem"],
          body [role="option"],
          body [role="menuitem"],
          body [role="listbox"] *,
          body [role="menu"] *,
          body [data-radix-select-viewport] *,
          body [data-radix-popper-content-wrapper] * {
            color: #ffffff !important;
          }

          /* Hover / Highlighted states for options/menuitems */
          body [role="option"]:hover,
          body [role="menuitem"]:hover,
          body [role="option"][data-highlighted],
          body [role="menuitem"][data-highlighted],
          body [role="option"]:hover *,
          body [role="menuitem"]:hover *,
          body [role="option"][data-highlighted] *,
          body [role="menuitem"][data-highlighted] * {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
          }
        ` }} />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="flex flex-col flex-1 md:ml-64">
            <AdminHeader />
            <main className="flex-grow bg-black p-4 md:p-6 text-white">{children}</main>
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
