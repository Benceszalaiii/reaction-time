"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  time: {
    label: "Score",
    color: "#06b6d4",
  },
} satisfies ChartConfig;

export function Chart({ times }: { times: number[] }) {
  const timeData = times.map((time, index) => ({ time, index }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>All scores</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={timeData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="index"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value + "."}
            />
            <YAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value + "ms"}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="time"
              type="linear"
              stroke="var(--color-time)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
