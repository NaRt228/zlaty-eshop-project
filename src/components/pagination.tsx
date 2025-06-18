"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Limit the number of visible pages
  const maxVisiblePages = 5
  let visiblePages = pages

  if (totalPages > maxVisiblePages) {
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    visiblePages = pages.slice(startPage - 1, endPage)

    if (startPage > 1) {
      visiblePages = [1, ...visiblePages]
    }

    if (endPage < totalPages) {
      visiblePages = [...visiblePages, totalPages]
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Předchozí stránka</span>
      </Button>

      {visiblePages.map((page, index) => {
        // Add ellipsis
        if (index > 0 && page > visiblePages[index - 1] + 1) {
          return (
            <span key={`ellipsis-${page}`} className="px-2">
              ...
            </span>
          )
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Další stránka</span>
      </Button>
    </div>
  )
}
