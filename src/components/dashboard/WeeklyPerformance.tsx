import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  LegendProps,
  Line,
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
import { colorPalettes, chartDefaults } from "@/lib/chart-colors";

const weeklyPerformanceData = [
  { day: "Mon", orders: 120, visitors: 1400 },
  { day: "Tue", orders: 140, visitors: 1600 },
  { day: "Wed", orders: 180, visitors: 2000 },
  { day: "Thu", orders: 160, visitors: 1800 },
  { day: "Fri", orders: 200, visitors: 2200 },
  { day: "Sat", orders: 220, visitors: 2400 },
  { day: "Sun", orders: 180, visitors: 2000 },
];

const WeeklyPerformanceTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md">
        <p className="font-medium text-slate-800 mb-1">{label}</p>
        {payload.map(({ name, value, color }, index) => (
          <p
            key={`item-${index}`}
            className="flex items-center text-sm"
            style={{ color }}
          >
            <span className="font-medium mr-2">{name}:</span>
            <span className="font-semibold">
              {name === "Visitors" ? value?.toLocaleString() : value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: LegendProps) => {
  if (payload && payload.length) {
    return (
      <div className="flex justify-center gap-6 mt-2">
        {payload.map(({ color, value }, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-sm mr-2"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-slate-700">{value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
const WeeklyPerformance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Performance</CardTitle>
        <CardDescription>Orders and visitors by day of week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyPerformanceData}>
            <CartesianGrid
              strokeDasharray={chartDefaults.grid.strokeDasharray}
              stroke={chartDefaults.grid.stroke}
              vertical={chartDefaults.grid.vertical}
            />
            <XAxis
              dataKey="day"
              stroke={chartDefaults.axis.stroke}
              tick={{
                fontSize: chartDefaults.axis.tick.fontSize,
                fill: chartDefaults.axis.tick.stroke,
              }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke={chartDefaults.axis.stroke}
              tick={{
                fontSize: chartDefaults.axis.tick.fontSize,
                fill: chartDefaults.axis.tick.stroke,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={chartDefaults.axis.stroke}
              tick={{
                fontSize: chartDefaults.axis.tick.fontSize,
                fill: chartDefaults.axis.tick.stroke,
              }}
            />
            <Tooltip>
              <WeeklyPerformanceTooltip />
            </Tooltip>
            <Legend content={<CustomLegend />} />
            <Bar
              yAxisId="left"
              dataKey="orders"
              name="Orders"
              fill={colorPalettes.secondary[0]}
              radius={[4, 4, 0, 0]}
              animationDuration={chartDefaults.animation.duration}
              animationEasing={
                chartDefaults.animation.easing as AnimationTiming
              }
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="visitors"
              name="Visitors"
              stroke={colorPalettes.primary[0]}
              strokeWidth={2}
              dot={{
                r: 4,
                strokeWidth: 2,
                stroke: colorPalettes.primary[0],
                fill: "white",
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: colorPalettes.primary[0],
                fill: "white",
              }}
              animationDuration={chartDefaults.animation.duration + 300}
              animationEasing={
                chartDefaults.animation.easing as AnimationTiming
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WeeklyPerformance;
