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
import { get_product, update_product } from "@/apis_reqests/products"
import { PageHeader } from "@/components/page-header"
import Image from "next/image"

interface Category {
  id: number
  name: string
}

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

export default function EditProductPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)
  const [product, setProduct] = useState<Product | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [stock, setStock] = useState("")
  const [specification, setSpecification] = useState("")
  const [material, setMaterial] = useState("")
  const [weight, setWeight] = useState("")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]| undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    ( async function() {
        const productData = await get_product(productId).then(e => e);
        setCategories(await get_categories().then(e => { console.log(e); return e }) || undefined)
        setProduct(productData)
        setName(productData.name)
        setDescription(productData.description)
        setPrice(productData.price.toString())
        setCategoryId(productData.category_id.toString())
        setStock(productData.stock.toString())
        setSpecification(productData.specification || "")
        setMaterial(productData.material || "")
        setWeight(productData.weight ? productData.weight.toString() : "")
      
    
    })()
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
        category_id: Number.parseInt(categoryId),
        stock: Number.parseInt(stock),
        specification,
        material,
        weight: Number.parseFloat(weight || "0"),
      }

      await update_product(productId, productData, mediaFiles)
      toast({
        title: "Produkt aktualizován",
        description: `Produkt "${name}" byl úspěšně aktualizován.`,
      })
      router.push("/admin/produkty")
    } catch (err: any) {
      setError(err.message || "Nepodařilo se aktualizovat produkt")
    } finally {
      setLoading(false)
    }
  }

  if (!product || !categories) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Načítání produktu...</p>
      </div>
    )
  }
else{
  alert(categories);
  return (
    <div className="space-y-6">
      <PageHeader title={`Upravit produkt: ${product.name}`} description="Upravte informace o produktu" />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Základní informace</CardTitle>
              <CardDescription>Upravte základní informace o produktu</CardDescription>
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
                  <SelectContent className="text-black">
                    {categories?.map((category) => (
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
              <CardDescription>Upravte další specifikace produktu</CardDescription>
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
                <Label>Aktuální obrázky</Label>
                <div className="grid grid-cols-3 gap-2">
                  {product.mediaUrls && product.mediaUrls.length > 0 ? (
                    product.mediaUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Obrázek ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground col-span-3">Žádné obrázky</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media">Přidat nové obrázky</Label>
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
                  <p className="text-sm text-muted-foreground mt-2">Vybráno {mediaFiles.length} nových souborů</p>
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
            {loading ? "Ukládání..." : "Uložit změny"}
          </Button>
        </div>
      </form>
    </div>
  )
}
 
}
