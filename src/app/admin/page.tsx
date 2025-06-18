import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardHeader } from "@/components/dashboard-header"
import LayoutWrapper from "@/components/LayoutWrapper"

export default function Home() {
  return (
    <LayoutWrapper><div className="space-y-6">
      <DashboardHeader />
      <DashboardStats />
    </div>
    </LayoutWrapper>
  )
}
