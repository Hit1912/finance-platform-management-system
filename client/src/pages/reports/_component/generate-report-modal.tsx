import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useGenerateReportMutation } from "@/features/report/reportAPI";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

export const GenerateReportModal = () => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const [open, setOpen] = useState(false);
    const [generateReport, { isLoading }] = useGenerateReportMutation();

    const handleGenerate = () => {
        if (!date?.from || !date?.to) {
            toast.error("Please select a date range");
            return;
        }

        generateReport({
            from: date.from.toISOString(),
            to: date.to.toISOString(),
        })
            .unwrap()
            .then((res: any) => {
                toast.success(res.message || "Report generated and sent!");
                setOpen(false);
            })
            .catch((err) => {
                toast.error(err.data?.message || "Failed to generate report");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="group/gen relative flex items-center gap-2 px-6 py-2.5 bg-accent-purple hover:bg-accent-purple/90 text-white border-0 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/gen:translate-x-full transition-transform duration-1000" />
                    <Send className="size-4 group-hover/gen:translate-x-1 group-hover/gen:-translate-y-1 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Generate Now</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card !fixed !top-1/2 !-translate-y-1/2 !left-1/2 !-translate-x-1/2 border-white/10 text-white shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-50">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight family-outfit">Generate Manual Report</DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs font-medium family-outfit opacity-80">
                        Select a date range to generate a manual financial report and send it to your email.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y")} -{" "}
                                                {format(date.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 rounded-xl shadow-[0_4px_20px_rgba(168,85,247,0.3)] transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="size-4 animate-spin mr-2" />
                        ) : (
                            <Send className="size-4 mr-2" />
                        )}
                        Generate & Send to Email
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
