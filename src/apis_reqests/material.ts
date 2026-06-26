"use client"

export interface Material {
  id: number
  name: string
}

const STORAGE_KEY = "admin_materials"

function loadMaterials(): Material[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Material[]
  } catch {
    return []
  }
}

function saveMaterials(materials: Material[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(materials))
}

export async function get_materials(): Promise<Material[]> {
  return loadMaterials()
}

export async function add_material(name: string): Promise<Material> {
  const materials = loadMaterials()
  const trimmed = name.trim()
  if (!trimmed) throw new Error("Název materiálu nesmí být prázdný")
  if (materials.some((m) => m.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error("Materiál s tímto názvem již existuje")
  }
  const newId = materials.length > 0 ? Math.max(...materials.map((m) => m.id)) + 1 : 1
  const newMaterial: Material = { id: newId, name: trimmed }
  saveMaterials([...materials, newMaterial])
  return newMaterial
}

export async function delete_material(id: number): Promise<boolean> {
  const materials = loadMaterials()
  const filtered = materials.filter((m) => m.id !== id)
  if (filtered.length === materials.length) return false
  saveMaterials(filtered)
  return true
}
