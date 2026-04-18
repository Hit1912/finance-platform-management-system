import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import TransactionForm from "./transaction-form";

const AddTransactionDrawer = () => {
  const [open, setOpen] = useState(false);

  const onCloseDrawer = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-premium h-14 px-10 border-0 group/add">
          <PlusIcon className="size-5 group-hover/add:rotate-90 transition-transform duration-500" />
          <span className="mt-0.5">Add Transaction</span>
        </Button>
      </DialogTrigger>
      {/* Drawer styled DialogContent */}
      <DialogContent
        hideClose
        className="!fixed !inset-y-0 !right-0 !left-auto !translate-x-0 !translate-y-0 w-full sm:!max-w-[540px] h-screen max-h-screen !rounded-none !border-l border-white/5 !bg-slate-950/95 !backdrop-blur-[120px] p-0 grid grid-rows-[auto_1fr] shadow-[-20px_0_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-700 overscroll-contain"
      >
        {/* Immersive Background Layer - Amethyst Deep Edition */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-purple/10 blur-[150px] rounded-full" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 blur-[120px] rounded-full" />
        </div>

        <DialogHeader className="relative p-8 md:p-12 border-b border-white/5 bg-white/5 flex flex-row items-baseline justify-between !text-left z-20 backdrop-blur-md">
          <div className="space-y-1.5">
            <DialogTitle className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
              New <span className="text-accent-purple underline underline-offset-8 decoration-8 decoration-accent-purple/20">Record</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
              Financial Intelligence System
            </DialogDescription>
          </div>
          <DialogClose className="hover:rotate-90 transition-transform duration-700 focus:outline-none ml-auto group">
            <div className="size-12 md:size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent-purple hover:border-accent-purple hover:shadow-[0_0_30px_rgba(var(--accent-purple),0.3)] transition-all duration-300">
              <XIcon className="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </DialogClose>
        </DialogHeader>

        <div className="overflow-y-auto relative z-10 bg-transparent h-full scroll-smooth">
          <TransactionForm onCloseDrawer={onCloseDrawer} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDrawer;
