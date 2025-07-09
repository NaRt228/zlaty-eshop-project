"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// Upravit importy pro novou strukturu API
import { get_products } from "@/apis_reqests/products"
import { get_categories } from "@/apis_reqests/category"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import Image from "next/image"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category_id: number
  stock: number
  specification: string
  material: string
  weight: number
  mediaUrls: string[]
}

interface Category {
  id: number
  name: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [, setTotalProducts] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  // Změnit volání funkcí v komponentě
  const fetchProducts = async (pageNum = 1) => {
    setLoading(true)
    try {
      const data = await get_products(pageNum)
      setProducts(data.products)
      setPage(data.page)
      setTotalPages(data.totalPages)
      setTotalProducts(data.totalProducts)
    } catch (err: any) {
      setError(err.message || "Nepodařilo se načíst produkty")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await get_categories()
      setCategories(data || [])
    } catch (err: any) {
      console.error("Nepodařilo se načíst kategorie:", err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Neznámá kategorie"
  }

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage)
  }

  const handleAddProduct = () => {
    router.push("/admin/produkty/pridat")
  }

  const handleEditProduct = (id: number) => {
    router.push(`/admin/produkty/upravit/${id}`)
  }

  const handleDeleteProduct = async (productId: number, productName: string) => {
    try {
      // Zde by měla být implementována delete_product funkce v API
      // await delete_product(productId)

      // Pro demonstraci - simulace úspěšného smazání
      toast({
        title: "Produkt smazán",
        description: `Produkt "${productName}" byl úspěšně smazán.`,
      })
      fetchProducts(page)
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: err.message || "Nepodařilo se smazat produkt",
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Správa produktů"
        description="Zde můžete spravovat produkty vašeho e-shopu"
        action={
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Přidat produkt
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Seznam produktů</CardTitle>
          <CardDescription>Přehled všech produktů ve vašem e-shopu</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obrázek</TableHead>
                  <TableHead>Název</TableHead>
                  <TableHead>Cena</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Skladem</TableHead>
                  <TableHead className="text-right">Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Načítání produktů...
                    </TableCell>
                  </TableRow>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.mediaUrls && product.mediaUrls.length > 0 ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-md">
                            <Image
                              src={product.mediaUrls[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                            Bez obrázku
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price.toLocaleString()} Kč</TableCell>
                      <TableCell>{getCategoryName(product.category_id)}</TableCell>
                      <TableCell>{product.stock} ks</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Upravit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Smazat produkt</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Smazat produkt</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Opravdu chcete smazat produkt &ldquo;{product.name}&ldquo;? Tato akce je nevratná.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Zrušit</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Smazat
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Žádné produkty nebyly nalezeny
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
