import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { colorPalettes, formatPercent } from "@/lib/chart-colors";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  type TooltipProps,
  type LegendProps,
} from "recharts";

const data = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Home & Kitchen", value: 20 },
  { name: "Beauty", value: 12 },
  { name: "Books", value: 8 },
];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md">
        <p className="font-medium text-slate-800">{payload[0].name}</p>
        <p
          className="text-lg font-semibold"
          style={{ color: payload[0].color }}
        >
          {formatPercent(payload[0].value as number)}
        </p>
      </div>
    );
  }

  return null;
};

const CustomLegend = (props: LegendProps) => {
  const { payload } = props;

  if (payload && payload.length) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-700 truncate">
              {entry.value}
            </span>
            <span className="text-sm font-medium ml-1 text-slate-600">
              {formatPercent(data[index].value)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const ProductCategoriesChart = () => {
  const COLORS = colorPalettes.categorical;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Product Categories</CardTitle>
        <CardDescription>Sales distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCategoriesChart;
