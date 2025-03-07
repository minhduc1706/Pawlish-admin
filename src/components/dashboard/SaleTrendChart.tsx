import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tooltip } from "../ui/tooltip";
import { AnimationTiming } from "recharts/types/util/types";
import {
  colorPalettes,
  chartDefaults,
  formatCurrency,
} from "@/lib/chart-colors";

const SalesTrendTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-amber-600 font-semibold">
          {formatCurrency(payload[0].value ?? 0)}
        </p>
      </div>
    );
  }
  return null;
};
const salesTrendData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 3390 },
  { name: "Jul", sales: 4490 },
  { name: "Aug", sales: 3490 },
  { name: "Sep", sales: 4200 },
  { name: "Oct", sales: 5100 },
  { name: "Nov", sales: 4800 },
  { name: "Dec", sales: 6000 },
];
const SaleTrendChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
        <CardDescription>
          Monthly sales performance for the year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesTrendData}>
            <defs>
              <linearGradient
                id="salesTrendGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={colorPalettes.categorical[4]}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={colorPalettes.categorical[4]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray={chartDefaults.grid.strokeDasharray}
              stroke={chartDefaults.grid.stroke}
              vertical={chartDefaults.grid.vertical}
            />
            <XAxis
              dataKey="name"
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
            <Tooltip>
              <SalesTrendTooltip />
            </Tooltip>
            <Area
              type="monotone"
              dataKey="sales"
              stroke={colorPalettes.categorical[4]}
              strokeWidth={2}
              fill="url(#salesTrendGradient)"
              activeDot={{
                r: 6,
                stroke: colorPalettes.categorical[4],
                strokeWidth: 2,
                fill: "#fff",
              }}
              animationDuration={chartDefaults.animation.duration}
              animationEasing={
                chartDefaults.animation.easing as AnimationTiming
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SaleTrendChart;
