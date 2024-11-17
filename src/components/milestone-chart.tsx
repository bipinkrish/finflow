import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { colors } from "@/lib/colors";
import { formatYearsFraction } from "@/lib/format";

interface MilestoneChartProps {
  data: Array<{
    crores: number;
    years: number;
    timeFromPrevious: number;
  }>;
}

export function MilestoneChart({ data }: MilestoneChartProps) {
  if (data.length < 1) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Crore Milestones</h3>
      <ChartContainer
        config={{
          timeFromPrevious: {
            label: "Time from Previous Crore",
            color: colors.graphs.milestone,
          },
        }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="crores"
              label={{
                value: "Crores (₹)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Years from Previous Crore",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          ₹{payload[0].payload.crores} Crore(s)
                        </span>
                        <span className="font-bold">
                          Reached in{" "}
                          {formatYearsFraction(
                            payload[0].payload.timeFromPrevious
                          )}{" "}
                        </span>
                        {payload[0].payload.timeFromPrevious && (
                          <span className="text-[0.70rem] text-muted-foreground">
                            Totaly took{" "}
                            {formatYearsFraction(payload[0].payload.years)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="timeFromPrevious" fill={colors.graphs.milestone} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
