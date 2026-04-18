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
import { CalendarIcon, XIcon } from "lucide-react";
import { useState } from "react";
import ScheduleReportForm from "./schedule-report-form";

const ScheduleReportDrawer = () => {
    const [open, setOpen] = useState(false);
    const onCloseDrawer = () => {
        setOpen(false);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="group/settings relative flex items-center gap-2 px-6 py-2.5 bg-accent-purple hover:bg-accent-purple/90 text-white border-0 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/settings:translate-x-full transition-transform duration-1000" />
                    <CalendarIcon className="size-4 text-white group-hover/settings:rotate-12 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Report Settings</span>
                </Button>
            </DialogTrigger>
            {/* Drawer styled DialogContent */}
            <DialogContent
                className="!fixed !inset-y-0 !right-0 !left-auto !translate-x-0 !translate-y-0 !w-full sm:!max-w-[500px] !h-full !rounded-none !border-l border-white/10 !bg-slate-950/95 !backdrop-blur-2xl p-0 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

                <DialogHeader className="relative p-8 border-b border-white/5 bg-white/[0.02] flex flex-row items-baseline justify-between !text-left">
                    <div className="space-y-1">
                        <DialogTitle className="text-3xl font-black tracking-tighter text-white family-outfit">
                            Report Settings
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm font-medium family-outfit opacity-80">
                            Enable or disable monthly financial report emails
                        </DialogDescription>
                    </div>
                    <DialogClose className="hover:rotate-90 transition-transform duration-300 focus:outline-none ml-auto">
                        <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
                            <XIcon className="h-5 w-5 text-slate-400" />
                        </div>
                    </DialogClose>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                    <ScheduleReportForm onCloseDrawer={onCloseDrawer} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleReportDrawer;
