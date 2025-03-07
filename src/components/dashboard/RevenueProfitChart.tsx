import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  colorPalettes,
  chartDefaults,
  formatCurrency,
} from "@/lib/chart-colors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
  type LegendProps,
} from "recharts";
import { AnimationTiming } from "recharts/types/util/types";

const data = [
  { month: "Jan", revenue: 18000, profit: 4500 },
  { month: "Feb", revenue: 16000, profit: 3800 },
  { month: "Mar", revenue: 21000, profit: 5200 },
  { month: "Apr", revenue: 19500, profit: 4800 },
  { month: "May", revenue: 22500, profit: 5600 },
  { month: "Jun", revenue: 25000, profit: 6200 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md">
        <p className="font-medium text-slate-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className="flex items-center text-sm"
            style={{ color: entry.color }}
          >
            <span className="font-medium mr-2">{entry.name}:</span>
            <span className="font-semibold">
              {formatCurrency(entry.value as number)}
            </span>
          </p>
        ))}
        {payload.length === 2 && (
          <p className="text-xs text-slate-500 mt-1 pt-1 border-t border-slate-100">
            {payload?.[0]?.value !== undefined &&
            payload?.[1]?.value !== undefined
              ? `${(
                  ((payload[1].value as number) / payload[0].value) *
                  100
                ).toFixed(1)}%`
              : "N/A"}
          </p>
        )}
      </div>
    );
  }

  return null;
};

const CustomLegend = (props: LegendProps) => {
  const { payload } = props;

  if (payload && payload.length) {
    return (
      <div className="flex justify-center gap-6 mt-2">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-sm mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const RevenueProfitChart = () => {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
  const profitMargin = (totalProfit / totalRevenue) * 100;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenue & Profit</CardTitle>
        <CardDescription>
          Profit margin: {profitMargin.toFixed(1)}%
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="text-purple-700 text-sm font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-900">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <p className="text-emerald-700 text-sm font-medium">Total Profit</p>
            <p className="text-2xl font-bold text-emerald-900">
              {formatCurrency(totalProfit)}
            </p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray={chartDefaults.grid.strokeDasharray}
                stroke={chartDefaults.grid.stroke}
                vertical={chartDefaults.grid.vertical}
              />
              <XAxis
                dataKey="month"
                stroke={chartDefaults.axis.stroke}
                tick={{
                  fontSize: chartDefaults.axis.tick.fontSize,
                  fill: chartDefaults.axis.tick.stroke,
                }}
              />
              <YAxis
                stroke={chartDefaults.axis.stroke}
                tick={{
                  fontSize: chartDefaults.axis.tick.fontSize,
                  fill: chartDefaults.axis.tick.stroke,
                }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={colorPalettes.secondary[1]}
                radius={[4, 4, 0, 0]}
                animationDuration={chartDefaults.animation.duration}
                animationEasing={
                  chartDefaults.animation.easing as AnimationTiming
                }
              />
              <Bar
                dataKey="profit"
                name="Profit"
                fill={colorPalettes.accent[0]}
                radius={[4, 4, 0, 0]}
                animationDuration={chartDefaults.animation.duration + 300}
                animationEasing={
                  chartDefaults.animation.easing as AnimationTiming
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueProfitChart;
