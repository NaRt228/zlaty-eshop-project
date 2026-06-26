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
import { get_materials, add_material, delete_material, Material } from "@/apis_reqests/material"
import { PageHeader } from "@/components/page-header"

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [newMaterialName, setNewMaterialName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchMaterials = async () => {
    try {
      const data = await get_materials()
      setMaterials(data || [])
    } catch (err: any) {
      setError(err.message || "Nepodařilo se načíst materiály")
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await add_material(newMaterialName)
      toast({
        title: "Materiál přidán",
        description: `Materiál "${newMaterialName}" byl úspěšně přidán.`,
      })
      setNewMaterialName("")
      setIsDialogOpen(false)
      fetchMaterials()
    } catch (err: any) {
      setError(err.message || "Nepodařilo se přidat materiál")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMaterial = async (materialId: number, materialName: string) => {
    try {
      const result = await delete_material(materialId)
      if (result === true) {
        toast({
          title: "Materiál smazán",
          description: `Materiál "${materialName}" byl úspěšně smazán.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Chyba",
          description: "Nepodařilo se smazat materiál",
        })
      }
      fetchMaterials()
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: err.message || "Nepodařilo se smazat materiál",
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Správa materiálů"
        description="Zde můžete spravovat materiály produktů vašeho e-shopu"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Přidat materiál
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Přidat nový materiál</DialogTitle>
              </DialogHeader>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="materialName">Název materiálu</Label>
                  <Input
                  className="text-black"
                    id="materialName"
                    placeholder="Např. Stříbro 925/1000"
                    value={newMaterialName}
                    onChange={(e) => setNewMaterialName(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">Zadejte název nového materiálu</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Přidávání..." : "Přidat materiál"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Seznam materiálů</CardTitle>
          <CardDescription>Přehled všech materiálů produktů ve vašem e-shopu</CardDescription>
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
                <TableHead>Název materiálu</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.length > 0 ? (
                materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.id}</TableCell>
                    <TableCell>{material.name}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Smazat materiál</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Smazat materiál</AlertDialogTitle>
                            <AlertDialogDescription>
                              Opravdu chcete smazat materiál &ldquo;{material.name}&ldquo;? Tato akce je nevratná.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Zrušit</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMaterial(material.id, material.name)}
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
                    Žádné materiály nebyly nalezeny
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
