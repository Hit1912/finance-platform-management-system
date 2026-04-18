import { useTypedSelector } from "@/app/hook";
import DashboardHeader from "./_component/dashboard-header";
import DashboardStats from "./_component/dashboard-stats";
import { DateRangeType } from "@/components/date-range-select";
import { usePageTransition } from "@/hooks/use-gsap";

const DashboardSummary = ({
  dateRange,
  setDateRange,
}: {
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}) => {
  const { user } = useTypedSelector((state) => state.auth);
  usePageTransition(".gsap-reveal", [dateRange, user]);

  return (
    <div className="w-full">
      <DashboardHeader
        title={`Welcome back, ${user?.name || "Unknow"}`}
        subtitle="This is your overview report for the selected period"
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <DashboardStats dateRange={dateRange} />
    </div>
  );
};

export default DashboardSummary;
