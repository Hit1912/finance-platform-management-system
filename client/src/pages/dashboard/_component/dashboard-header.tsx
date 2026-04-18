import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";

interface Props {
  title: string;
  subtitle: string;
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}

const DashboardHeader = ({ title, subtitle, dateRange, setDateRange }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8 pt-4">
      <div className="space-y-1">
        <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter">{title}</h2>
        <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase opacity-70">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3 w-full lg:w-auto">
        <DateRangeSelect dateRange={dateRange || null} setDateRange={(range) => setDateRange?.(range)} />
        <AddTransactionDrawer />
      </div>
    </div>
  );
};

export default DashboardHeader;
