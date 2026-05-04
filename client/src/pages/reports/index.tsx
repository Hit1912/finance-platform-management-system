import {
  Card,
  CardContent,
} from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import ScheduleReportDrawer from "./_component/schedule-report-drawer";
import ReportTable from "./_component/report-table";
import { usePageTransition } from "@/hooks/use-gsap";
import { GenerateReportModal } from "./_component/generate-report-modal";


export default function Reports() {
  usePageTransition(".gsap-reveal");

  return (
    <PageLayout
      title="Report Center"
      subtitle="Comprehensive insights into your financial health"
      addMarginTop
      rightAction={
        <div className="flex items-center gap-3">
          <GenerateReportModal />
          <ScheduleReportDrawer />
        </div>
      }
    >
      <div className="gsap-reveal space-y-6">
        {/* Statistics or info cards could go here in future */}

        <Card className="glass-card border-0 !shadow-none overflow-hidden relative group">
          {/* Animated orbit glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 blur-3xl rounded-full pointer-events-none transition-all duration-700 group-hover:bg-primary/20" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          <CardContent className="relative z-10 p-0">
            <ReportTable />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
