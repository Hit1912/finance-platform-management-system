import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

const DashboardRecentTransactions = () => {
  return (
    <Card className="glass-card border border-border shadow-md rounded-[24px] gsap-reveal mt-10 overflow-hidden">
      <CardHeader className="pb-0 pt-8 px-8">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black text-foreground tracking-tighter">Recent Transactions</CardTitle>
            <CardDescription className="text-muted-foreground text-xs font-semibold uppercase tracking-widest opacity-60">Your latest financial activity</CardDescription>
          </div>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-10 px-6 border-border hover:bg-secondary text-foreground font-black rounded-xl transition-all duration-300 shadow-sm"
          >
            <Link to={PROTECTED_ROUTES.TRANSACTIONS} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em]">
              View All
              <ArrowUpDown className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="h-px w-full mt-6 bg-border/40" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-1">
          <TransactionTable pageSize={5} isShowPagination={false} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTransactions;
