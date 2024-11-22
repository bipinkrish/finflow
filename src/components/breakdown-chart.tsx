import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { colors } from "@/lib/colors";
import { formatCurrency, formatNumberWithUnits } from "@/lib/format";

interface BreakdownChartProps {
  data: Array<{ name: string; value: number }>;
  calculatorType: string;
}

export function BreakdownChart({ data, calculatorType }: BreakdownChartProps) {
  if (data.length < 2 || !data.some((d) => d.value > 0)) {
    return null;
  }

  return (
    <div className="w-[86%] flex flex-col md:flex-row md:gap-4 items-start">
      {/* Left: Chart */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4 w-max">
          {calculatorType === "SIP" ? "Investment" : "Withdrawal"} Breakdown
        </h3>
        <ChartContainer
          config={{
            primary: {
              label: data[0].name,
              color: colors.graphs.investment,
            },
            secondary: {
              label: data[1].name,
              color: colors.graphs.profit,
            },
          }}
          className="h-[200px] -ml-[20%] md:ml-0"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                <Cell fill={colors.graphs.investment} />
                <Cell fill={colors.graphs.profit} />
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].name}
                          </span>
                          <span className="font-bold">
                            {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Right: Labels and Values */}
      <div className="flex-1 h-full content-center flex-col md:flex-row md:mt-0 md:ml-0 md:mr-[16%] w-1/2 md:-ml-2 md:w-[86%]">
        <ul className="space-y-2 md:space-y-0 md:flex md:flex-col">
          {[colors.graphs.investment, colors.graphs.profit].map(
            (color, index) => (
              <li key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">
                  {data[index].name}
                </span>
                <span className="font-semibold ml-auto">
                  ₹{formatNumberWithUnits(data[index].value)}
                </span>
              </li>
            )
          )}
        </ul>
        <hr className="my-2" />
        <div className="text-sm font-medium flex items-center">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{
              background: `linear-gradient(-60deg, ${colors.graphs.investment} 50%, ${colors.graphs.profit} 50%)`,
            }}
          />
          Total Value
          <span className="font-semibold ml-auto text-base">
            ₹{formatNumberWithUnits(data[0].value + data[1].value)}
          </span>
        </div>
      </div>
    </div>
  );
}
