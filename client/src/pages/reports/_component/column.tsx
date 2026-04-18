import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { _REPORT_STATUS, ReportStatusType } from "@/constant";
import { ReportType } from "@/features/report/reportType";
import { useDeleteReportMutation, useResendReportMutation } from "@/features/report/reportAPI";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ReportActions = ({ reportId }: { reportId: string }) => {
  const [resendReport, { isLoading: isResending }] = useResendReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  const handleResend = () => {
    resendReport(reportId)
      .unwrap()
      .then(() => toast.success("Report resent successfully"))
      .catch(() => toast.error("Failed to resend report"));
  };

  const handleDelete = () => {
    deleteReport(reportId)
      .unwrap()
      .then(() => toast.success("Report deleted successfully"))
      .catch(() => toast.error("Failed to delete report"));
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 px-3 bg-white/5 hover:bg-primary/20 text-slate-300 hover:text-white border border-white/5 hover:border-primary/30 rounded-lg transition-all duration-300 gap-2 text-xs font-semibold"
        onClick={handleResend}
        disabled={isResending || isDeleting}
      >
        {isResending ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
        Resend
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/30 rounded-lg transition-all duration-300"
        onClick={handleDelete}
        disabled={isResending || isDeleting}
      >
        {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      </Button>
    </div>
  );
};

export const reportColumns: ColumnDef<ReportType>[] = [
  {
    accessorKey: "period",
    header: "Report Period",
    size: 150,
    cell: ({ row }) => {
      const period = row.getValue("period") as string;
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Clock className="size-4 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-slate-200">{period}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sentDate",
    header: "Sent Date",
    size: 100,
    cell: ({ row }) => {
      const date = new Date(row.original.sentDate);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusStyles = {
        [_REPORT_STATUS.SENT]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        [_REPORT_STATUS.FAILED]: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        [_REPORT_STATUS.PENDING]: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        [_REPORT_STATUS.PROCESSING]: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        [_REPORT_STATUS.NO_ACTIVITY]: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      };

      const style =
        statusStyles[status as ReportStatusType] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
            style
          )}
        >
          {status}
        </span>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    header: "Actions",
    size: 100,
    cell: ({ row }) => <ReportActions reportId={row.original._id} />,
  },

  {
    id: "-",
    header: "",
  },
  {
    id: "-",
    header: "",
  },
];
