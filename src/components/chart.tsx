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
    <Card className="w-full">
      <CardHeader className="p-2 px-4">
        <CardTitle>All scores</CardTitle>
      </CardHeader>
      <CardContent className="p-0.5">
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={timeData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="index"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value + 1 + "."}
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
