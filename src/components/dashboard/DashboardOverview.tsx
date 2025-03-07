import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  CalendarCheck,
  DollarSign,
  PackageMinus,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart,
  Download,
  RefreshCw,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Define the stats data structure
interface Stat {
  title: string
  value: number | string
  icon: React.ElementType
  change: number
  changeLabel?: string
  color?: string
  secondaryValue?: string
}

// Define the stats data
const fakeStats: Record<string, Stat[]> = {
  Today: [
    {
      title: "Customers",
      value: 150,
      icon: Users,
      change: 5,
      changeLabel: "from yesterday",
      color: "blue",
      secondaryValue: "+12 new",
    },
    {
      title: "Appointments",
      value: 10,
      icon: CalendarCheck,
      change: -8,
      changeLabel: "from yesterday",
      color: "indigo",
      secondaryValue: "3 pending",
    },
    {
      title: "Revenue",
      value: "$200",
      icon: DollarSign,
      change: 12,
      changeLabel: "from yesterday",
      color: "green",
      secondaryValue: "Avg $20/order",
    },
    {
      title: "Low Stock Products",
      value: 2,
      icon: PackageMinus,
      change: -3,
      changeLabel: "from yesterday",
      color: "amber",
      secondaryValue: "Restock needed",
    },
  ],
  Week: [
    {
      title: "Customers",
      value: 950,
      icon: Users,
      change: 8,
      changeLabel: "from last week",
      color: "blue",
      secondaryValue: "+45 new",
    },
    {
      title: "Appointments",
      value: 75,
      icon: CalendarCheck,
      change: 5,
      changeLabel: "from last week",
      color: "indigo",
      secondaryValue: "12 pending",
    },
    {
      title: "Revenue",
      value: "$1,450",
      icon: DollarSign,
      change: 18,
      changeLabel: "from last week",
      color: "green",
      secondaryValue: "Avg $19.33/order",
    },
    {
      title: "Low Stock Products",
      value: 8,
      icon: PackageMinus,
      change: -2,
      changeLabel: "from last week",
      color: "amber",
      secondaryValue: "Restock needed",
    },
  ],
  Month: [
    {
      title: "Customers",
      value: 4000,
      icon: Users,
      change: 12,
      changeLabel: "from last month",
      color: "blue",
      secondaryValue: "+180 new",
    },
    {
      title: "Appointments",
      value: 320,
      icon: CalendarCheck,
      change: 15,
      changeLabel: "from last month",
      color: "indigo",
      secondaryValue: "45 pending",
    },
    {
      title: "Revenue",
      value: "$12,000",
      icon: DollarSign,
      change: 25,
      changeLabel: "from last month",
      color: "green",
      secondaryValue: "Avg $37.50/order",
    },
    {
      title: "Low Stock Products",
      value: 25,
      icon: PackageMinus,
      change: -5,
      changeLabel: "from last month",
      color: "amber",
      secondaryValue: "Restock needed",
    },
  ],
  Year: [
    {
      title: "Customers",
      value: 50000,
      icon: Users,
      change: 20,
      changeLabel: "from last year",
      color: "blue",
      secondaryValue: "+8,500 new",
    },
    {
      title: "Appointments",
      value: 4500,
      icon: CalendarCheck,
      change: 30,
      changeLabel: "from last year",
      color: "indigo",
      secondaryValue: "98% completion rate",
    },
    {
      title: "Revenue",
      value: "$150,000",
      icon: DollarSign,
      change: 40,
      changeLabel: "from last year",
      color: "green",
      secondaryValue: "Avg $33.33/order",
    },
    {
      title: "Low Stock Products",
      value: 100,
      icon: PackageMinus,
      change: -10,
      changeLabel: "from last year",
      color: "amber",
      secondaryValue: "Inventory turnover: 12x",
    },
  ],
}

type FilterType = keyof typeof fakeStats

// Color mapping for the stat cards
const colorMap: Record<string, { bg: string; text: string; icon: string; light: string }> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "text-blue-500",
    light: "bg-blue-100",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: "text-green-500",
    light: "bg-green-100",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    icon: "text-indigo-500",
    light: "bg-indigo-100",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: "text-amber-500",
    light: "bg-amber-100",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: "text-red-500",
    light: "bg-red-100",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: "text-purple-500",
    light: "bg-purple-100",
  },
}

const MiniSparkline = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
  const height = (index: number) => {
    if (trend === "up") {
      return 4 + index * 2
    } else if (trend === "down") {
      return 12 - index * 2
    } else {
      return [6, 8, 4, 10, 6][index]
    }
  }

  return (
    <div className="flex items-end h-8 gap-[2px]">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={cn(
            "w-1 rounded-sm",
            trend === "up" ? "bg-green-400" : trend === "down" ? "bg-red-400" : "bg-gray-400",
          )}
          style={{ height: `${height(index)}px` }}
        />
      ))}
    </div>
  )
}

const DashboardOverview = () => {
  const [filter, setFilter] = useState<FilterType>("Today")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleFilterChange = (selectedFilter: FilterType) => {
    setFilter(selectedFilter)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const filteredStats = fakeStats[filter]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Tabs
            value={filter}
            onValueChange={(value) => handleFilterChange(value as FilterType)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="Today" className="text-xs sm:text-sm">
                <Calendar className="h-3 w-3 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Today</span>
                <span className="sm:hidden">Day</span>
              </TabsTrigger>
              <TabsTrigger value="Week" className="text-xs sm:text-sm">
                <Calendar className="h-3 w-3 mr-1 sm:mr-2" />
                <span>Week</span>
              </TabsTrigger>
              <TabsTrigger value="Month" className="text-xs sm:text-sm">
                <Calendar className="h-3 w-3 mr-1 sm:mr-2" />
                <span>Month</span>
              </TabsTrigger>
              <TabsTrigger value="Year" className="text-xs sm:text-sm">
                <BarChart className="h-3 w-3 mr-1 sm:mr-2" />
                <span>Year</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="sr-only">Refresh data</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStats.map((stat) => {
          const isPositive = stat.change >= 0
          const color = stat.color || (isPositive ? "green" : "red")
          const colorClasses = colorMap[color]

          return (
            <Card key={stat.title} className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <BarChart className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download Report</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div
                        className={cn(
                          "flex items-center mr-2 px-1 py-0.5 rounded",
                          isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100",
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        <span>{Math.abs(stat.change)}%</span>
                      </div>
                      <span>{stat.changeLabel}</span>
                    </div>
                    {stat.secondaryValue && (
                      <div className="text-xs font-medium text-muted-foreground">{stat.secondaryValue}</div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className={cn("p-2 rounded-full", colorClasses.bg)}>
                      <stat.icon className={cn("h-5 w-5", colorClasses.icon)} />
                    </div>
                    <MiniSparkline trend={isPositive ? "up" : "down"} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default DashboardOverview

