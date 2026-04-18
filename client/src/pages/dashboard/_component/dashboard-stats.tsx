import { useSummaryAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import SummaryCard from "./summary-card";
import { DateRangeType } from "@/components/date-range-select";
import { useTypedSelector } from "@/app/hook";
import useDebouncedSearch from "@/hooks/use-debounce-search";

const DashboardStats = ({ dateRange }: { dateRange?: DateRangeType }) => {
  const { searchTerm } = useTypedSelector((state) => state.settings);
  const { debouncedTerm } = useDebouncedSearch(searchTerm, { delay: 500 });

  const { data, isFetching } = useSummaryAnalyticsQuery(
    { preset: dateRange?.value, keyword: debouncedTerm },
    { skip: !dateRange }
  );
  const summaryData = data?.data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <SummaryCard
        title="Available Balance"
        value={summaryData?.availableBalance}
        dateRange={dateRange}
        percentageChange={summaryData?.percentageChange?.balance}
        isLoading={isFetching}
        cardType="balance"
      />
      <SummaryCard
        title="Total Income"
        value={summaryData?.totalIncome}
        percentageChange={summaryData?.percentageChange?.income}
        dateRange={dateRange}
        isLoading={isFetching}
        cardType="income"
      />
      <SummaryCard
        title="Total Expenses"
        value={summaryData?.totalExpenses}
        dateRange={dateRange}
        percentageChange={summaryData?.percentageChange?.expenses}
        isLoading={isFetching}
        cardType="expenses"
      />
      <SummaryCard
        title="Savings Rate"
        value={summaryData?.savingRate?.percentage}
        expenseRatio={summaryData?.savingRate?.expenseRatio}
        isPercentageValue
        dateRange={dateRange}
        isLoading={isFetching}
        cardType="savings"
      />
    </div>
  );
};

export default DashboardStats;
