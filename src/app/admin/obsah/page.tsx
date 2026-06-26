"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Save, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { get_content, update_content, upload_content_image } from "@/apis_reqests/content"
import Image from "next/image"

export default function ContentManagementPage() {
  const [form, setForm] = useState<any>({
    heroTitle: "",
    heroText: "",
    heroImageUrl: "",
    aboutTitle: "",
    aboutText: "",
    aboutImageUrl: "",
    card1Title: "",
    card1Text: "",
    card1ImageUrl: "",
    card2Title: "",
    card2Text: "",
    card2ImageUrl: "",
    card3Title: "",
    card3Text: "",
    card3ImageUrl: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const loadData = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await get_content()
      if (data) {
        setForm(data)
      } else {
        setError("Nepodařilo se načíst obsah webu.")
      }
    } catch (err: any) {
      setError(err.message || "Chyba při načítání obsahu.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (key: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleFileChange = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setUploadingFields((prev) => ({ ...prev, [key]: true }))
    
    try {
      const url = await upload_content_image(file)
      if (url) {
        setForm((prev: any) => ({ ...prev, [key]: url }))
        toast({
          title: "Obrázek nahrán",
          description: "Nový obrázek byl úspěšně nahrán.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Chyba nahrávání",
          description: "Nepodařilo se nahrát vybraný soubor.",
        })
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: err.message || "Došlo k chybě při nahrávání souboru.",
      })
    } finally {
      setUploadingFields((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      await update_content(form)
      toast({
        title: "Obsah uložen",
        description: "Obsah webu byl úspěšně aktualizován a publikován.",
      })
    } catch (err: any) {
      setError(err.message || "Chyba při ukládání obsahu.")
      toast({
        variant: "destructive",
        title: "Uložení selhalo",
        description: "Při ukládání obsahu došlo k chybě.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
        <span className="ml-3 text-neutral-500">Načítání obsahu...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Správa obsahu webu"
        description="Zde můžete upravovat texty a obrázky na hlavní stránce a v sekci 'O mně'."
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* HERO SECTION */}
        <Card>
          <CardHeader>
            <CardTitle>Hlavní sekce (Hero)</CardTitle>
            <CardDescription>
              Tato část se nachází v horní části úvodní stránky.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hlavní titulek</Label>
              <Input
                id="heroTitle"
                value={form.heroTitle}
                onChange={(e) => handleChange("heroTitle", e.target.value)}
                placeholder="Výroba autorských šperků"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heroText">Doprovodný text</Label>
              <Textarea
                id="heroText"
                rows={4}
                value={form.heroText}
                onChange={(e) => handleChange("heroText", e.target.value)}
                placeholder="Popis činnosti a tvorby..."
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Obrázek hlavní sekce</Label>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative w-48 h-48 bg-neutral-900 border rounded overflow-hidden flex-shrink-0">
                  {form.heroImageUrl ? (
                    <Image
                      src={form.heroImageUrl}
                      alt="Hero preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                      Žádný obrázek
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("heroImageUrl", e)}
                    disabled={uploadingFields["heroImageUrl"]}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Doporučený poměr stran je 4:5 nebo čtverec. Max velikost 100MB.
                  </p>
                  {uploadingFields["heroImageUrl"] && (
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> Nahrávání...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ABOUT SECTION */}
        <Card>
          <CardHeader>
            <CardTitle>Sekce O mně</CardTitle>
            <CardDescription>
              Obsah stránky popisující autorku (/about).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="aboutTitle">Jméno / Titulek</Label>
              <Input
                id="aboutTitle"
                value={form.aboutTitle}
                onChange={(e) => handleChange("aboutTitle", e.target.value)}
                placeholder="Jovana Šichová"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutText">Životopis / O mně text</Label>
              <Textarea
                id="aboutText"
                rows={5}
                value={form.aboutText}
                onChange={(e) => handleChange("aboutText", e.target.value)}
                placeholder="Napište něco o sobě..."
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Profilová fotografie</Label>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative w-48 h-48 bg-neutral-900 border rounded overflow-hidden flex-shrink-0">
                  {form.aboutImageUrl ? (
                    <Image
                      src={form.aboutImageUrl}
                      alt="About preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                      Žádná fotografie
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("aboutImageUrl", e)}
                    disabled={uploadingFields["aboutImageUrl"]}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Doporučený poměr stran 3:4 nebo profilový formát. Max velikost 100MB.
                  </p>
                  {uploadingFields["aboutImageUrl"] && (
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> Nahrávání...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SHOWCASE CARDS */}
        <Card>
          <CardHeader>
            <CardTitle>Autorská tvorba (3 kolekce)</CardTitle>
            <CardDescription>
              Tři propagační karty s odkazy do obchodu umístěné na úvodní stránce.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Card 1 */}
            <div className="border-b pb-6 space-y-4">
              <h3 className="font-medium text-sm text-neutral-800 uppercase tracking-wider">První karta (vlevo)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card1Title">Titulek</Label>
                  <Input
                    id="card1Title"
                    value={form.card1Title}
                    onChange={(e) => handleChange("card1Title", e.target.value)}
                    placeholder="Prsteny"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card1Text">Podtitulek</Label>
                  <Input
                    id="card1Text"
                    value={form.card1Text}
                    onChange={(e) => handleChange("card1Text", e.target.value)}
                    placeholder="Ručně kované detaily"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Obrázek karty 1</Label>
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 bg-neutral-900 border rounded overflow-hidden flex-shrink-0">
                    {form.card1ImageUrl ? (
                      <Image
                        src={form.card1ImageUrl}
                        alt="Card 1 preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500">
                        Bez obr.
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("card1ImageUrl", e)}
                    disabled={uploadingFields["card1ImageUrl"]}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border-b pb-6 space-y-4">
              <h3 className="font-medium text-sm text-neutral-800 uppercase tracking-wider">Druhá karta (střední)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card2Title">Titulek</Label>
                  <Input
                    id="card2Title"
                    value={form.card2Title}
                    onChange={(e) => handleChange("card2Title", e.target.value)}
                    placeholder="Přívěsky"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card2Text">Podtitulek</Label>
                  <Input
                    id="card2Text"
                    value={form.card2Text}
                    onChange={(e) => handleChange("card2Text", e.target.value)}
                    placeholder="Inspirace přírodou"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Obrázek karty 2</Label>
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 bg-neutral-900 border rounded overflow-hidden flex-shrink-0">
                    {form.card2ImageUrl ? (
                      <Image
                        src={form.card2ImageUrl}
                        alt="Card 2 preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500">
                        Bez obr.
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("card2ImageUrl", e)}
                    disabled={uploadingFields["card2ImageUrl"]}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-neutral-800 uppercase tracking-wider">Třetí karta (vpravo)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card3Title">Titulek</Label>
                  <Input
                    id="card3Title"
                    value={form.card3Title}
                    onChange={(e) => handleChange("card3Title", e.target.value)}
                    placeholder="Náušnice"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card3Text">Podtitulek</Label>
                  <Input
                    id="card3Text"
                    value={form.card3Text}
                    onChange={(e) => handleChange("card3Text", e.target.value)}
                    placeholder="Elegance a harmonie"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Obrázek karty 3</Label>
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 bg-neutral-900 border rounded overflow-hidden flex-shrink-0">
                    {form.card3ImageUrl ? (
                      <Image
                        src={form.card3ImageUrl}
                        alt="Card 3 preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500">
                        Bez obr.
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("card3ImageUrl", e)}
                    disabled={uploadingFields["card3ImageUrl"]}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* SAVE BUTTON */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={saving}
            className="px-6 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Ukládání...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Uložit a publikovat
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  )
}
