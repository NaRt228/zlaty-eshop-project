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
import { AlertCircle, Upload, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Upravit importy pro novou strukturu API
import { get_categories } from "@/apis_reqests/category"
import { get_product, update_product, delete_product_media } from "@/apis_reqests/products"
import { get_materials, Material as MaterialType } from "@/apis_reqests/material"
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { Category } from "@/interface/category"
import { Products } from "@/utils/interfaces/IFetchGallery"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)
  const [product, setProduct] = useState<Products | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [stock, setStock] = useState("")
  const [specification, setSpecification] = useState("")
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<number[]>([])
  const [weight, setWeight] = useState("")
  const [productionType, setProductionType] = useState("Autorská")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]| undefined>(undefined)
  const [materialOptions, setMaterialOptions] = useState<MaterialType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    ( async function() {
        const productData = await get_product(productId).then(e => e);
        const [cats, mats] = await Promise.all([get_categories(), get_materials()]);
        setCategories(cats || undefined)
        setMaterialOptions(mats || [])
        setProduct(productData)
        setName(productData.name)
        setDescription(productData.description)
        setPrice(productData.price.toString())
        setCategoryId(productData.categoryId.toString())
        setStock(productData.stock.toString())
        setSpecification(productData.specification || "")
        const matchedMaterialIds = mats
          ?.filter((m) => productData.materials?.some((pm: string) => pm.toLowerCase() === m.name.toLowerCase()))
          .map((m) => m.id) || []
        setSelectedMaterialIds(matchedMaterialIds)
        setWeight(productData.weight ? productData.weight.toString() : "")
        setProductionType(productData.productionType || "Autorská")
       
    })()
  }, [])

  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [mediaPreviews])

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      if (filesArray.length + mediaFiles.length > 10) {
        setError("Můžete nahrát maximálně 10 souborů")
        return
      }
      setMediaFiles((prev) => [...prev, ...filesArray])

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
      setMediaPreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const handleRemoveNewMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index])
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index))
  }
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const selectedMaterials = selectedMaterialIds
        .map((id) => materialOptions.find((m) => m.id === id)?.name)
        .filter(Boolean) as string[]

      const productData = {
        name,
        description,
        price: Number.parseFloat(price),
        categoryId: Number.parseInt(categoryId),
        stock: Number.parseInt(stock),
        specification,
        materials: selectedMaterials,
        weight: Number.parseFloat(weight || "0"),
        productionType,
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

  const handleDeleteMedia = async (mediaUrl: string) => {
    if (!window.confirm("Opravdu chcete smazat tento obrázek?")) return

    try {
      await delete_product_media(productId, mediaUrl)
      
      setProduct((prev) => {
        if (!prev) return null
        return {
          ...prev,
          mediaUrls: prev.mediaUrls.filter((url) => url !== mediaUrl),
        }
      })

      toast({
        title: "Obrázek smazán",
        description: "Obrázek byl úspěšně odstraněn.",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Chyba při mazání obrázku",
        description: err.message || "Nepodařilo se odstranit obrázek.",
      })
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
  console.log(product);
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
                <Select defaultValue={product.categoryId.toString() ?? ""} value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte kategorii" />
                  </SelectTrigger>
                  <SelectContent className=" text-black">
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productionType">Typ výroby *</Label>
                <Select value={productionType} onValueChange={setProductionType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte typ výroby" />
                  </SelectTrigger>
                  <SelectContent className=" text-black">
                    <SelectItem value="Autorská">Autorská tvorba</SelectItem>
                    <SelectItem value="Sériová">Sériová výroba</SelectItem>
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
                <Label>Materiály</Label>
                <div className="grid grid-cols-2 gap-2 border p-3 rounded-md bg-neutral-950 border-neutral-800">
                  {materialOptions.map((mat) => {
                    const isChecked = selectedMaterialIds.includes(mat.id);
                    return (
                      <label key={mat.id} className="flex items-center space-x-2 text-sm cursor-pointer hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMaterialIds((prev) => [...prev, mat.id])
                            } else {
                              setSelectedMaterialIds((prev) => prev.filter((id) => id !== mat.id))
                            }
                          }}
                          className="rounded border-neutral-800 bg-neutral-900 text-neutral-500 focus:ring-0 cursor-pointer"
                        />
                        <span>{mat.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Hmotnost (g)</Label>
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
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border group">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Obrázek ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(url)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                          title="Smazat obrázek"
                        >
                          <X className="h-4 w-4" />
                        </button>
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
                {mediaPreviews.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label>Náhled vybraných nových obrázků ({mediaPreviews.length})</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {mediaPreviews.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border group">
                          <img
                            src={url}
                            alt={`Nový náhled ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewMedia(index)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                            title="Odstranit"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
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
