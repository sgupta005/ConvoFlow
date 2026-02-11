"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"

import { WeeklyData } from "../lib/dashboard-utils"

const chartConfig = {
  count: {
    label: "Meetings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function MeetingActivityChart({ weeklyData }: { weeklyData: WeeklyData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Activity</CardTitle>
        <CardDescription>Last 8 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={weeklyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

