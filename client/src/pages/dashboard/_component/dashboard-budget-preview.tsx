import { Card, CardContent } from "@/components/ui/card";
import { PieChart, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useGetFinanceOverviewQuery } from "@/features/finance/financeAPI";

const DashboardBudgetPreview = () => {
    const { data, isLoading } = useGetFinanceOverviewQuery();

    if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>;

    const budgets = data?.data?.budgets || [];
    const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0) || 85000;
    
    // Total spent is aggregated from categories in our overview
    const totalSpent = (data?.data?.categories || []).reduce((acc, c) => acc + c.total, 0) || 0;
    const spentPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    return (
        <Card className="glass-card h-full relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 size-32 bg-accent-purple/10 blur-[50px] rounded-full pointer-events-none" />
            
            <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Budget Status</h4>
                    <PieChart className="size-4 text-accent" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white family-outfit tracking-tighter">₹{totalSpent.toLocaleString()}</span>
                        <span className="text-xs font-medium text-slate-500">/ ₹{totalBudget.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${spentPercent}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-accent to-accent-purple"
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-accent">{spentPercent.toFixed(1)}% Spent</span>
                            <div className="flex items-center gap-1 text-emerald-500">
                                <TrendingUp className="size-3" />
                                <span>{spentPercent > 90 ? "Critical" : "On Track"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Daily Avg</p>
                        <p className="text-sm font-black text-white family-outfit">₹1,410</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Projected</p>
                        <p className="text-sm font-black text-white family-outfit">₹78,000</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardBudgetPreview;
