import { Card, CardContent } from "@/components/ui/card";
import { Receipt, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { useGetFinanceOverviewQuery } from "@/features/finance/financeAPI";
import { format } from "date-fns";

const DashboardBillsPreview = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetFinanceOverviewQuery();

    if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>;

    const bills = data?.data?.bills || [];

    return (
        <Card className="glass-card h-full">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Upcoming Bills</h4>
                    <Receipt className="size-4 text-accent-purple" />
                </div>

                <div className="space-y-3">
                    {bills.length === 0 ? (
                        <div className="py-4 text-center border border-dashed border-white/10 rounded-xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No active bills</p>
                        </div>
                    ) : (
                        bills.slice(0, 3).map((bill, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    {bill.status === 'OVERDUE' ? <AlertCircle className="size-4 text-rose-500 animate-pulse" /> : <div className="size-1.5 rounded-full bg-accent" />}
                                    <div>
                                        <p className="text-[13px] font-bold text-white family-outfit tracking-tight">{bill.provider}</p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${bill.status === 'OVERDUE' ? 'text-rose-500' : 'text-slate-500'}`}>{format(new Date(bill.dueDate), "MMM dd")}</p>
                                    </div>
                                </div>
                                <p className="text-[13px] font-black text-white family-outfit">₹{bill.amount}</p>
                            </div>
                        ))
                    )}
                </div>

                <Button 
                    onClick={() => navigate(PROTECTED_ROUTES.BILLS)}
                    variant="ghost" 
                    className="w-full mt-2 h-10 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                    Manage Bills
                    <ArrowRight className="size-3 ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default DashboardBillsPreview;
