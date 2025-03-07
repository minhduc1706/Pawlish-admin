import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { colorPalettes, chartDefaults, formatCurrency } from "@/lib/chart-colors"
import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { AnimationTiming } from "recharts/types/util/types"

const dailyData = [
  { date: "Mon", sales: 4000 },
  { date: "Tue", sales: 3000 },
  { date: "Wed", sales: 5000 },
  { date: "Thu", sales: 2780 },
  { date: "Fri", sales: 1890 },
  { date: "Sat", sales: 3390 },
  { date: "Sun", sales: 4490 },
]

const weeklyData = [
  { date: "Week 1", sales: 24000 },
  { date: "Week 2", sales: 21000 },
  { date: "Week 3", sales: 30000 },
  { date: "Week 4", sales: 18000 },
]

const monthlyData = [
  { date: "Jan", sales: 85000 },
  { date: "Feb", sales: 72000 },
  { date: "Mar", sales: 93000 },
  { date: "Apr", sales: 94000 },
  { date: "May", sales: 82000 },
  { date: "Jun", sales: 106000 },
  { date: "Jul", sales: 105000 },
  { date: "Aug", sales: 110000 },
  { date: "Sep", sales: 108000 },
  { date: "Oct", sales: 119000 },
  { date: "Nov", sales: 127000 },
  { date: "Dec", sales: 138000 },
]

type TimeRange = "daily" | "weekly" | "monthly"

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-sky-600 font-semibold">{formatCurrency(payload[0].value as number)}</p>
      </div>
    )
  }

  return null
}

const SalesOverviewChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly")

  const data = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  }[timeRange]

  const totalSales = data.reduce((sum, item) => sum + item.sales, 0)

  const avgSales = totalSales / data.length

  const highestSales = data.reduce((max, item) => (item.sales > max.sales ? item : max), { date: "", sales: 0 })

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Total sales: {formatCurrency(totalSales)}</CardDescription>
        </div>
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)} className="w-[240px]">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-sky-50 rounded-lg p-3 border border-sky-100">
            <p className="text-sky-700 text-sm font-medium">Total Sales</p>
            <p className="text-2xl font-bold text-sky-900">{formatCurrency(totalSales)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="text-purple-700 text-sm font-medium">Average Sales</p>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(avgSales)}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <p className="text-emerald-700 text-sm font-medium">Highest Sales</p>
            <p className="text-2xl font-bold text-emerald-900">{formatCurrency(highestSales.sales)}</p>
            <p className="text-xs text-emerald-600">{highestSales.date}</p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorPalettes.primary[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colorPalettes.primary[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray={chartDefaults.grid.strokeDasharray}
                stroke={chartDefaults.grid.stroke}
                vertical={chartDefaults.grid.vertical}
              />
              <XAxis
                dataKey="date"
                stroke={chartDefaults.axis.stroke}
                tick={{ fontSize: chartDefaults.axis.tick.fontSize, fill: chartDefaults.axis.tick.stroke }}
              />
              <YAxis
                stroke={chartDefaults.axis.stroke}
                tick={{ fontSize: chartDefaults.axis.tick.fontSize, fill: chartDefaults.axis.tick.stroke }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke={colorPalettes.primary[1]}
                strokeWidth={2}
                fill="url(#salesGradient)"
                activeDot={{ r: 6, stroke: colorPalettes.primary[2], strokeWidth: 2, fill: "#fff" }}
                animationDuration={chartDefaults.animation.duration}
                animationEasing={chartDefaults.animation.easing as AnimationTiming}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesOverviewChart

