import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { colors } from "@/lib/colors";
import { formatCurrency } from "@/lib/format";
import { calcGraphsSize } from "@/lib/utils";

interface GrowthChartProps {
  data: Array<{ year: number; value: number }>;
  calculatorType: string;
}

export function GrowthChart({ data, calculatorType }: GrowthChartProps) {
  if (!data.some((d) => d.value > 0)) {
    return null;
  }
  const heightWeightStyle = calcGraphsSize(4);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 w-max">
        {calculatorType == "SIP" ? "Investment Growth" : "Withdrawl"} Chart
      </h3>
      <ChartContainer
        config={{
          value: {
            label: "Investment Value",
            color: colors.graphs.growth,
          },
        }}
        style={{...heightWeightStyle, marginLeft: "-4%"}}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              tickFormatter={(value) => `₹${(value / 1_00_00_000)}Cr`}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Year
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.year}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Value
                          </span>
                          <span className="font-bold">
                            {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.graphs.growth}
              name="Investment Value"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
