"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Upravit importy pro novou strukturu API
import { get_categories } from "@/apis_reqests/category"
import { add_product } from "@/apis_reqests/products"
import { PageHeader } from "@/components/page-header"

interface Category {
  id: number
  name: string
}

export default function AddProductPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [stock, setStock] = useState("")
  const [specification, setSpecification] = useState("")
  const [material, setMaterial] = useState("")
  const [weight, setWeight] = useState("")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Změnit volání funkcí v komponentě
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get_categories()
        setCategories(data || [])
      } catch (err: any) {
        setError(err.message || "Nepodařilo se načíst kategorie")
      }
    }

    fetchCategories()
  }, [])

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      if (filesArray.length > 10) {
        setError("Můžete nahrát maximálně 10 souborů")
        return
      }
      setMediaFiles(filesArray)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const productData = {
        name,
        description,
        price: Number.parseFloat(price),
        categoryId: Number.parseInt(categoryId),
        stock: Number.parseInt(stock),
        specification,
        material,
        weight: Number.parseFloat(weight || "0"),
      }

      await add_product(productData, mediaFiles)
      toast({
        title: "Produkt přidán",
        description: `Produkt "${name}" byl úspěšně přidán.`,
      })
      router.push("/admin/produkty")
    } catch (err: any) {
      setError(err.message || "Nepodařilo se přidat produkt")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Přidat nový produkt" description="Vytvořte nový produkt pro váš e-shop" />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Základní informace</CardTitle>
              <CardDescription>Zadejte základní informace o produktu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Název produktu *</Label>
                <Input
                  id="name"
                  placeholder="Např. Smartphone XYZ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Popis produktu *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailní popis produktu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Cena (Kč) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Skladem (ks) *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategorie *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte kategorii" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Další specifikace</CardTitle>
              <CardDescription>Zadejte další specifikace produktu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specification">Specifikace</Label>
                <Textarea
                  id="specification"
                  placeholder="Technické specifikace produktu..."
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">Materiál</Label>
                <Input
                  id="material"
                  placeholder="Např. Kov, Plast, Dřevo..."
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Hmotnost (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="media">Obrázky produktu</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Přetáhněte soubory sem nebo klikněte pro výběr</p>
                  <p className="text-xs text-muted-foreground">Podporované formáty: JPG, PNG, GIF (max. 10 souborů)</p>
                  <Input
                    id="media"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleMediaChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => document.getElementById("media")?.click()}
                  >
                    Vybrat soubory
                  </Button>
                </div>
                {mediaFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">Vybráno {mediaFiles.length} souborů</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/produkty")}>
            Zrušit
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Ukládání..." : "Uložit produkt"}
          </Button>
        </div>
      </form>
    </div>
  )
}
