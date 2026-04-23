import DashboardDataChart from "./dashboard-data-chart";
import DashboardSummary from "./dashboard-summary";
import PageLayout from "@/components/page-layout";
//import ExpenseBreakDown from "./expense-breakdown";
import ExpensePieChart from "./expense-pie-chart";
import DashboardRecentTransactions from "./dashboard-recent-transactions";
import DashboardBillsPreview from "./_component/dashboard-bills-preview";
import DashboardBudgetPreview from "./_component/dashboard-budget-preview";
import { useState } from "react";
import { usePageTransition, useHoverPulse, useFloatingAnimation } from "@/hooks/use-gsap";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Button } from "@/components/ui/button";

import { DateRangeEnum, DateRangeType } from "@/components/date-range-select";

const Dashboard = () => {
  const [dateRange, _setDateRange] = useState<DateRangeType>({
    from: null,
    to: null,
    value: DateRangeEnum.ALL_TIME,
    label: "All Time",
  });
  const navigate = useNavigate();

  // Apply premium animations
  usePageTransition(".gsap-reveal", [dateRange]);
  useHoverPulse(".glass-card");
  useFloatingAnimation(".floating-icon");

  return (
    <div className="w-full flex flex-col">
      <PageLayout
        className="space-y-6"
        renderPageHeader={
          <DashboardSummary
            dateRange={dateRange}
            setDateRange={_setDateRange}
          />
        }
      >
        {/* Row 1: Main Insights & Actions */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4 gsap-reveal">
            <DashboardDataChart dateRange={dateRange} />
          </div>
          <div className="lg:col-span-2 gsap-reveal">
            <DashboardBillsPreview />
          </div>
        </div>

        {/* Row 2: Secondary Analytics */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-2 gsap-reveal">
            <DashboardBudgetPreview />
          </div>
          <div className="lg:col-span-2 gsap-reveal">
            <ExpensePieChart dateRange={dateRange} />
          </div>
          <div className="lg:col-span-2 gsap-reveal">
            {/* Future Goals Preview Card */}
            <Card className="glass-card h-full bg-accent-purple/[0.03] border-accent-purple/10 flex flex-col items-center justify-center p-8 text-center space-y-4">
                 <div className="size-16 rounded-3xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                    <Trophy className="size-8" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-lg font-black text-white family-outfit tracking-tight">Active Goals</h4>
                    <p className="text-xs font-medium text-slate-500 family-outfit max-w-[150px]">Track your path to the Tesla Model S Plaid.</p>
                 </div>
                 <Button onClick={() => navigate(PROTECTED_ROUTES.GOALS)} variant="link" className="text-accent-purple font-black uppercase tracking-widest text-[10px]">
                    View all goals
                 </Button>
            </Card>
          </div>
        </div>

        {/* Dashboard Recent Transactions */}
        <div className="w-full mt-2 gsap-reveal">
          <DashboardRecentTransactions />
        </div>
      </PageLayout>
    </div>
  );
};

export default Dashboard;
