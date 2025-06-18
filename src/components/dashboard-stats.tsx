import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Tag, Users } from "lucide-react"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Celkem produktů</CardTitle>
          <Package className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">25</div>
          <p className="text-xs text-gray-500">+2 za poslední týden</p>
        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Celkem kategorií</CardTitle>
          <Tag className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">5</div>
        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Položek v košíku</CardTitle>
          <ShoppingCart className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">12</div>
          <p className="text-xs text-gray-500">+3 za poslední den</p>
        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Uživatelé</CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">1</div>
          <p className="text-xs text-gray-500">Administrátor</p>
        </CardContent>
      </Card>
    </div>
  )
}
