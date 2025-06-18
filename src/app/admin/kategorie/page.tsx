"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { get_categories, add_category } from "@/apis_reqests/category"
import { PageHeader } from "@/components/page-header"
import { delete_category } from "@/apis_reqests/category"

interface Category {
  id: number
  name: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Změnit volání funkcí v komponentě
  const fetchCategories = async () => {
    try {
      const data = await get_categories()
      setCategories(data || [])
    } catch (err: any) {
      setError(err.message || "Nepodařilo se načíst kategorie")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await add_category(newCategoryName)
      toast({
        title: "Kategorie přidána",
        description: `Kategorie "${newCategoryName}" byla úspěšně přidána.`,
      })
      setNewCategoryName("")
      setIsDialogOpen(false)
      fetchCategories()
    } catch (err: any) {
      setError(err.message || "Nepodařilo se přidat kategorii")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    try {
      // Zde by měla být implementována delete_category funkce v API
      await delete_category(categoryId)

      // Pro demonstraci - simulace úspěšného smazání
      toast({
        title: "Kategorie smazána",
        description: `Kategorie "${categoryName}" byla úspěšně smazána.`,
      })
      fetchCategories()
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: err.message || "Nepodařilo se smazat kategorii",
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Správa kategorií"
        description="Zde můžete spravovat kategorie produktů vašeho e-shopu"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Přidat kategorii
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Přidat novou kategorii</DialogTitle>
              </DialogHeader>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Název kategorie</Label>
                  <Input
                    id="categoryName"
                    placeholder="Např. Elektronika"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">Zadejte název nové kategorie produktů</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Přidávání..." : "Přidat kategorii"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Seznam kategorií</CardTitle>
          <CardDescription>Přehled všech kategorií produktů ve vašem e-shopu</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Název kategorie</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Smazat kategorii</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Smazat kategorii</AlertDialogTitle>
                            <AlertDialogDescription>
                              Opravdu chcete smazat kategorii "{category.name}"? Tato akce je nevratná.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Zrušit</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Smazat
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Žádné kategorie nebyly nalezeny
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
