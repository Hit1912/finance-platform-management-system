import { FC } from "react";
import CountUp from "react-countup";
import { TrendingDownIcon, TrendingUpIcon, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercentage } from "@/lib/format-percentage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DateRangeEnum, DateRangeType } from "@/components/date-range-select";
import { useFormatCurrency } from "@/hooks/use-format-currency";

type CardType = "balance" | "income" | "expenses" | "savings";
type CardStatus = {
  label: string;
  color: string;
  Icon: LucideIcon;
  description?: string;
};
interface SummaryCardProps {
  title: string;
  value?: number;
  dateRange?: DateRangeType;
  percentageChange?: number;
  isPercentageValue?: boolean;
  isLoading?: boolean;
  expenseRatio?: number;
  cardType: CardType;
}

const getCardStatus = (
  value: number,
  cardType: CardType,
  expenseRatio?: number
): CardStatus => {
  if (cardType === "savings") {
    if (value === 0) {
      return {
        label: "No Savings Record",
        color: "text-gray-400",
        Icon: TrendingDownIcon,
      };
    }

    // Check savings percentage first
    if (value < 10) {
      return {
        label: "Low Savings",
        color: "text-red-400",
        Icon: TrendingDownIcon,
        description: `Only ${value.toFixed(1)}% saved`,
      };
    }

    if (value < 20) {
      return {
        label: "Moderate",
        color: "text-yellow-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio?.toFixed(0)}% spent`,
      };
    }

    // High savings → check if expense ratio is unusually high for warning
    if (expenseRatio && expenseRatio > 75) {
      return {
        label: "High Spend",
        color: "text-red-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    if (expenseRatio && expenseRatio > 60) {
      return {
        label: "Warning: High Spend",
        color: "text-orange-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    return {
      label: "Good Savings",
      color: "text-green-400",
      Icon: TrendingUpIcon,
    };
  }

  if (value === 0) {
    const typeLabel =
      cardType === "income"
        ? "Income"
        : cardType === "expenses"
          ? "Expenses"
          : "Balance";

    return {
      label: `No ${typeLabel}`,
      color: "text-gray-400",
      Icon: TrendingDownIcon,
      description: ``,
    };
  }

  // For balance card when negative
  if (cardType === "balance" && value < 0) {
    return {
      label: "Overdrawn",
      color: "text-destructive font-semibold",
      Icon: TrendingDownIcon,
      description: "Balance is negative",
    };
  }

  if (cardType === "income") {
    return {
      label: "Total Earned",
      color: "text-success",
      Icon: TrendingUpIcon,
    };
  }

  if (cardType === "expenses") {
    return {
      label: "Total Spent",
      color: "text-destructive",
      Icon: TrendingDownIcon,
    };
  }

  return {
    label: "",
    color: "",
    Icon: TrendingDownIcon,
  };
};

const getTrendDirection = (value: number, cardType: CardType) => {
  if (cardType === "expenses") {
    // For expenses, lower is better
    return value <= 0 ? "positive" : "negative";
  }
  // For income and balance, higher is better
  return value >= 0 ? "positive" : "negative";
};

const SummaryCard: FC<SummaryCardProps> = ({
  title,
  value = 0,
  dateRange,
  percentageChange,
  isPercentageValue,
  isLoading,
  expenseRatio,
  cardType = "balance",
}) => {
  const formatCurrency = useFormatCurrency();
  const status = getCardStatus(value, cardType, expenseRatio);
  const showTrend =
    percentageChange !== undefined &&
    percentageChange !== null &&
    cardType !== "savings";

  const trendDirection =
    showTrend && percentageChange !== 0
      ? getTrendDirection(percentageChange, cardType)
      : null;

  if (isLoading) {
    return (
      <Card className="glass-card border border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 !pb-5">
          <Skeleton className="h-4 w-24 bg-muted" />
        </CardHeader>
        <CardContent className="space-y-8">
          <Skeleton className="h-10.5 w-full bg-muted" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12 bg-muted" />
            <Skeleton className="h-3 w-16 bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCountupValue = (val: number) => {
    return isPercentageValue
      ? formatPercentage(val, { decimalPlaces: 1 })
      : formatCurrency(val, {
        isExpense: cardType === "expenses",
        showSign: cardType === "balance" && val < 0,
      });
  };

  return (
    <div className="gsap-reveal w-full">
      <Card className="glass-card border border-border shadow-md rounded-[24px] overflow-hidden group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
          <CardTitle className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.15em]">
            {title}
          </CardTitle>
          <div className="size-10 rounded-xl bg-secondary flex items-center justify-center border border-border group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:rotate-6 transition-all duration-500">
             {cardType === 'income' ? <TrendingUpIcon className="size-5 text-success" /> : 
              cardType === 'expenses' ? <TrendingDownIcon className="size-5 text-destructive" /> :
              <TrendingUpIcon className="size-5 text-accent" /> }
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div
            className={cn(
              "text-3xl lg:text-4xl font-black tracking-tighter py-1 transition-all duration-300",
              cardType === "balance" && value < 0 ? "text-destructive" : 
              cardType === "income" ? "text-success" :
              "text-foreground"
            )}
          >
            <CountUp
              start={0}
              end={value}
              preserveValue
              decimals={2}
              decimalPlaces={2}
              formattingFn={formatCountupValue}
            />
          </div>

          <div className="mt-4">
            {cardType === "savings" ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-[10px] font-black uppercase tracking-wider w-fit border border-success/20">
                <status.Icon className="size-3.5" />
                <span>
                  {status.label} {value !== 0 && `(${formatPercentage(value)})`}
                </span>
              </div>
            ) : dateRange?.value === DateRangeEnum.ALL_TIME ? (
              <span className="text-muted-foreground/60 text-[10px] uppercase font-bold tracking-widest bg-secondary/50 px-2 py-0.5 rounded">All-time overview</span>
            ) : showTrend ? (
              <div className="flex items-center gap-3">
                {percentageChange !== 0 && (
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black tracking-wide border shadow-sm",
                      trendDirection === "positive"
                        ? "text-success bg-success/10 border-success/20"
                        : "text-destructive bg-destructive/10 border-destructive/20"
                    )}
                  >
                    {trendDirection === "positive" ? (
                      <TrendingUpIcon className="size-3.5" />
                    ) : (
                      <TrendingDownIcon className="size-3.5" />
                    )}
                    <span>
                      {formatPercentage(Math.abs(percentageChange || 0), {
                        showSign: false,
                        decimalPlaces: 1,
                      })}%
                    </span>
                  </div>
                )}
                <span className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-[0.1em]">vs last period</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground/60 text-[11px] font-bold uppercase tracking-wider">
                <status.Icon className="size-3.5" />
                <span>{status.label || "No activity"}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCard;
