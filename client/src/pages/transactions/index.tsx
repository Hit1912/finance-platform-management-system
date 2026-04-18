import {
  Card,
  CardContent,
} from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";
import { usePageTransition } from "@/hooks/use-gsap";

export default function Transactions() {
  usePageTransition(".gsap-reveal");

  return (
    <PageLayout
      title="Transaction History"
      subtitle="Comprehensive view of all your financial movements"
      addMarginTop
      rightAction={
        <div className="flex flex-wrap items-center gap-3">
          <ImportTransactionModal />
          <AddTransactionDrawer />
        </div>
      }
    >
      <div className="gsap-reveal">
        <Card className="glass-card border-0 !shadow-none overflow-hidden relative">
          <div className="absolute top-0 left-0 p-20 bg-primary/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
          <CardContent className="relative z-10 pt-6">
            <TransactionTable pageSize={20} />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
