import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-state";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { DateRangeType } from "@/components/date-range-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useChartAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import { useTypedSelector } from "@/app/hook";
import useDebouncedSearch from "@/hooks/use-debounce-search";


interface PropsType {
  dateRange?: DateRangeType;
}

const COLORS = ["var(--color-success)", "var(--color-destructive)"];
const TRANSACTION_TYPES = ["income", "expenses"];

const chartConfig = {
  income: {
    label: "Income",
    color: COLORS[0],
  },
  expenses: {
    label: "Expenses",
    color: COLORS[1],
  },
} satisfies ChartConfig;

const DashboardDataChart: React.FC<PropsType> = (props) => {
  const { dateRange } = props;
  const isMobile = useIsMobile();


  const { searchTerm } = useTypedSelector((state) => state.settings);
  const { debouncedTerm } = useDebouncedSearch(searchTerm, { delay: 500 });

  const { data, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
    keyword: debouncedTerm
  });
  const chartData = data?.data?.chartData || [];
  const totalExpenseCount = data?.data?.totalExpenseCount || 0;
  const totalIncomeCount = data?.data?.totalIncomeCount || 0;

  if (isFetching) {
    return <ChartSkeleton />;
  }

  return (
    <Card className="glass-card border border-border/50 shadow-md rounded-[24px] gsap-reveal overflow-hidden">
      <CardHeader
        className="flex flex-col items-stretch !space-y-0 border-b border-border/40 sm:flex-row !p-0 pr-1 transition-colors"
      >
        <div className="flex flex-1 flex-col justify-center gap-1 px-8 py-5 sm:py-0">
          <CardTitle className="text-xl font-black text-foreground tracking-tighter">Transaction Overview</CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-semibold uppercase tracking-widest opacity-60">
            <span>Activity for {dateRange?.label || "selected period"}</span>
          </CardDescription>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap">
          {TRANSACTION_TYPES.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <div
                key={chart}
                className="flex flex-1 flex-col justify-center gap-1.5 px-8 py-5 text-center border-t sm:border-t-0 sm:border-l border-border/40 min-w-40 hover:bg-secondary/20 transition-all duration-300"
              >
                <span className="w-full block text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground opacity-50">
                  {chartConfig[chart].label}
                </span>
                <span className="flex items-center justify-center gap-2 text-2xl font-black text-foreground leading-none">
                  {key === TRANSACTION_TYPES[0] ? (
                    <TrendingUpIcon className="size-4 text-success" />
                  ) : (
                    <TrendingDownIcon className="size-4 text-destructive" />
                  )}
                  {key === TRANSACTION_TYPES[0]
                    ? totalIncomeCount
                    : totalExpenseCount}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-8 sm:px-8 h-[320px]">
        {chartData?.length === 0 ? (
          <EmptyState
            title="No transaction data"
            description="There are no transactions recorded for this period."
          />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart data={chartData || []}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="expensesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={isMobile ? 20 : 25}
                tickFormatter={(value) =>
                  format(new Date(value), isMobile ? "MMM d" : "MMM d")
                }
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              />
              <ChartTooltip
                cursor={{
                  stroke: "#e2e8f0",
                  strokeWidth: 1,
                }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), "MMM d, yyyy")
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="expenses"
                type="monotone"
                fill="url(#expensesGradient)"
                stroke={COLORS[1]}
                strokeWidth={2}
              />
              <Area
                dataKey="income"
                type="monotone"
                fill="url(#incomeGradient)"
                stroke={COLORS[0]}
                strokeWidth={2}
              />
              <ChartLegend
                verticalAlign="bottom"
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = () => (
  <Card className="glass-card border border-border/50 !pt-0">
    <CardHeader className="flex flex-col items-stretch !space-y-0 border-b border-border sm:flex-row !p-0 pr-1">
      <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-0 sm:py-0">
        <Skeleton className="h-6 w-48 bg-muted" />
        <Skeleton className="h-4 w-32 mt-1 bg-muted" />
      </div>
      <div className="flex">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l 
            sm:border-l border-border sm:px-4 sm:py-6 min-w-40"
          >
            <Skeleton className="h-4 w-20 mx-auto bg-muted" />
            <Skeleton className="h-8 w-24 mx-auto mt-1 sm:h-12 bg-muted" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="px-2 pt-2 sm:px-6 sm:pt-2 h-[280px]">
      <Skeleton className="h-full w-full bg-muted" />
    </CardContent>
  </Card>
);

export default DashboardDataChart;
