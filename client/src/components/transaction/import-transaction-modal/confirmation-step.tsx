import { useState } from "react";
import { z } from "zod";
import { ChevronDown, ChevronLeft, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { _TRANSACTION_TYPE, PAYMENT_METHODS_ENUM } from "@/constant";
import { toast } from "sonner";
import { MAX_IMPORT_LIMIT } from "@/constant";
import { BulkTransactionType } from "@/features/transaction/transationType";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { useBulkImportTransactionMutation } from "@/features/transaction/transactionAPI";

type ConfirmationStepProps = {
  file: File | null;
  mappings: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any[];
  onComplete: () => void;
  onBack: () => void;
};

const transactionSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  amount: z
    .number({
      invalid_type_error: "Amount must be a number",
      required_error: "Amount is required",
    })
    .positive("Amount must be greater than zero"),
  date: z.preprocess(
    (val) => new Date(val as string),
    z.date({
      invalid_type_error: "Invalid date format",
      required_error: "Date is required",
    })
  ),
  type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE], {
    invalid_type_error: "Invalid transaction type",
    required_error: "Transaction type is required",
  }),
  category: z.string({
    required_error: "Category is required",
  }),
  paymentMethod: z
    .union([
      z.literal(""),
      z.undefined(),
      z.enum(
        [
          PAYMENT_METHODS_ENUM.CARD,
          PAYMENT_METHODS_ENUM.BANK_TRANSFER,
          PAYMENT_METHODS_ENUM.MOBILE_PAYMENT,
          PAYMENT_METHODS_ENUM.AUTO_DEBIT,
          PAYMENT_METHODS_ENUM.CASH,
          PAYMENT_METHODS_ENUM.OTHER,
        ],
        {
          errorMap: (issue) => ({
            message:
              issue.code === "invalid_enum_value"
                ? `Payment method must be one of: ${Object.values(PAYMENT_METHODS_ENUM).join(", ")}`
                : "Invalid payment method",
          }),
        }
      ),
    ])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

const ConfirmationStep = ({
  file,
  mappings,
  csvData,
  onComplete,
  onBack,
}: ConfirmationStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    progress,
    isLoading,
    startProgress,
    updateProgress,
    doneProgress,
    resetProgress,
  } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const [bulkImportTransaction] = useBulkImportTransactionMutation();

  const handleImport = () => {
    const { transactions, hasValidationErrors } =
      getAssignFieldToMappedTransactions();
    console.log(transactions, "transactions");

    if (hasErrors || hasValidationErrors) return;

    if (transactions.length > MAX_IMPORT_LIMIT) {
      toast.error(`Cannot import more than ${MAX_IMPORT_LIMIT} transactions`);
      return;
    }
    resetProgress();
    startProgress(10);
    // Start progress
    let currentProgress = 10;
    const interval = setInterval(() => {
      const increment = currentProgress < 90 ? 10 : 1;
      currentProgress = Math.min(currentProgress + increment, 90);
      updateProgress(currentProgress);
    }, 250);

    const payload = { transactions: transactions as BulkTransactionType[] };

    console.log(payload, "payload");

    bulkImportTransaction(payload)
      .unwrap()
      .then(() => {
        updateProgress(100);
        toast.success("Imported transactions successfully");
      })
      .catch((error) => {
        resetProgress();
        toast.error(error.data?.message || "Failed to import transactions");
      })
      .finally(() => {
        clearInterval(interval);
        setTimeout(() => {
          doneProgress();
          resetProgress();
          onComplete();
        }, 500);
      });
  };

  const getAssignFieldToMappedTransactions = () => {
    let hasValidationErrors = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: Partial<any>[] = [];

    csvData.forEach((row, index) => {
      const transaction: Record<string, string> = {};
      // Apply mappings
      Object.entries(mappings).forEach(([csvColumn, transactionField]) => {
        if (transactionField === "Skip" || row[csvColumn] === undefined) return;
        transaction[transactionField] =
          transactionField === "amount"
            ? Number(row[csvColumn])
            : transactionField === "date"
              ? new Date(row[csvColumn])
              : row[csvColumn];
      });
      try {
        const validated = transactionSchema.parse(transaction);
        results.push(validated);
      } catch (error) {
        hasValidationErrors = true;
        const message =
          error instanceof z.ZodError
            ? error.errors
              .map((e) => {
                if (e.path[0] === "type")
                  return "Transaction type:- must be INCOME or EXPENSE";
                if (e.path[0] === "paymentMethod")
                  return (
                    "Payment method:- must be one of: " +
                    Object.values(PAYMENT_METHODS_ENUM).join(", ")
                  );
                return `${e.path[0]}: ${e.message}`;
              })
              .join("\n")
            : "Invalid data";
        setErrors((prev) => ({
          ...prev,
          [index + 1]: message,
        }));
      }
    });
    return { transactions: results, hasValidationErrors };
  };

  const hasErrors = Object.keys(errors).length > 0;

  console.log(errors, "errors");

  return (
    <div className="p-10 md:p-14 space-y-12 relative flex flex-col items-center">
      <DialogHeader className="relative z-10 text-center flex flex-col items-center gap-3">
        <DialogTitle className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
          Final <span className="text-accent underline underline-offset-8 decoration-8 decoration-accent/20">Audit</span>
        </DialogTitle>
        <DialogDescription className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
          Verifying Data Integrity Protocol
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-8 w-full relative z-10">
        <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-10 shadow-inner">
          <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-10">
            <FileCheck className="size-5" />
            Import Intelligence Summary
          </h4>
          <div className="grid grid-cols-2 gap-y-10 gap-x-12">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/50">Origin File</p>
              <p className="text-sm font-black text-white truncate max-w-[200px]">{file?.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/50">Active Mappings</p>
              <p className="text-sm font-black text-white">{Object.keys(mappings).length} Attributes</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/50">Data Volume</p>
              <div className="flex items-center gap-3">
                <p className="text-sm font-black text-white">{csvData.length}</p>
                <span className="text-[8px] font-black uppercase tracking-widest bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full">Validated</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/50">Security Limit</p>
              <p className="text-sm font-black text-white">{MAX_IMPORT_LIMIT} Units</p>
            </div>
          </div>
        </div>

        {hasErrors && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-[32px] overflow-hidden">
            <div className="px-8 py-4 bg-destructive/10 border-b border-destructive/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive">
                Critical Exceptions Found ({Object.keys(errors).length})
              </p>
            </div>
            <div className="p-6 space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
              {Object.entries(errors).map(([row, msg]) => (
                <details key={row} className="group/issue">
                  <summary className="flex items-center justify-between cursor-pointer py-2 hover:bg-white/5 px-4 rounded-xl transition-all">
                    <span className="text-[10px] font-black text-slate-400 group-open/issue:text-destructive tracking-widest uppercase transition-colors">Record {row}</span>
                    <ChevronDown className="size-4 text-slate-500 transform group-open/issue:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-3 pl-6 pr-4 text-xs font-bold text-destructive/80 leading-relaxed border-l-2 border-destructive/30 ml-4 mb-4">
                    {msg.split("\n").map((line, i) => (
                      <p key={i} className="py-1">{line}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-accent-purple animate-pulse">
              <span>Synchronizing Financial Core</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 w-full bg-white/5 border border-white/5" />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center w-full pt-4">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="rounded-2xl h-14 px-8 hover:bg-white/5 text-slate-400 font-black uppercase tracking-widest text-[10px]"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Adjust Mappings
        </Button>
        <Button
          onClick={handleImport}
          disabled={isLoading}
          className="btn-premium rounded-2xl h-14 px-12 shadow-[0_10px_30px_rgba(var(--accent-purple),0.3)] disabled:opacity-30 disabled:shadow-none transition-all font-black uppercase tracking-widest text-[10px]"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Syncing...
            </div>
          ) : "Finalize Import"}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
