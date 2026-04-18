import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import TransactionForm from "./transaction-form";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";

const EditTransactionDrawer = () => {
  const { open, transactionId, onCloseDrawer } =
    useEditTransactionDrawer();

  return (
    <Dialog open={open} onOpenChange={onCloseDrawer}>
      {/* Drawer styled DialogContent */}
      <DialogContent
        hideClose
        className="!fixed !inset-y-0 !right-0 !left-auto !translate-x-0 !translate-y-0 !w-full sm:!max-w-[500px] !h-full !rounded-none !border-l border-white/10 !bg-slate-950/95 !backdrop-blur-2xl p-0 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        <DialogHeader className="relative p-8 border-b border-white/5 bg-white/[0.02] flex flex-row items-baseline justify-between !text-left">
          <div className="space-y-1">
            <DialogTitle className="text-3xl font-black tracking-tighter text-white">
              Edit Transaction
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm font-medium">
              Update your financial records.
            </DialogDescription>
          </div>
          <DialogClose className="hover:rotate-90 transition-transform duration-300 focus:outline-none ml-auto">
            <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
              <XIcon className="h-5 w-5 text-slate-400" />
            </div>
          </DialogClose>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 relative z-10">
          <TransactionForm
            isEdit
            transactionId={transactionId}
            onCloseDrawer={onCloseDrawer}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDrawer;
