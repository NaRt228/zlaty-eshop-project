"use client"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of page numbers to show
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're at the beginning
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4)
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3)
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always include last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-10 mb-10">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 bg-[#ECDFCC] text-black rounded ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d6c4aa]"
        }`}
      >
        Předchozí
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => goToPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded ${
                currentPage === page
                  ? "bg-[#d6c4aa] text-black font-bold"
                  : "bg-[#ECDFCC] text-black hover:bg-[#d6c4aa]"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="w-10 h-10 flex items-center justify-center text-white">
              {page}
            </span>
          ),
        )}
      </div>

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 bg-[#ECDFCC] text-black rounded ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d6c4aa]"
        }`}
      >
        Další
      </button>
    </div>
  )
}

export default Pagination
