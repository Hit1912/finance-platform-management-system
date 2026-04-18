import PageLayout from "@/components/page-layout";
import { usePageTransition } from "@/hooks/use-gsap";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, TrendingDown, TrendingUp, Wallet, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useGetFinanceOverviewQuery } from "@/features/finance/financeAPI";

const Budget = () => {
    usePageTransition(".gsap-reveal");
    const { data, isLoading } = useGetFinanceOverviewQuery();

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-accent" /></div>;

    const liveBudgets = data?.data?.budgets || [];
    const liveCategories = data?.data?.categories || [];

    const totalBudgetAmount = liveBudgets.reduce((acc, b) => acc + b.amount, 0) || 0;
    const totalSpentAmount = liveCategories.reduce((acc, c) => acc + c.total, 0) || 0;
    const remainingAmount = Math.max(totalBudgetAmount - totalSpentAmount, 0);

    return (
        <PageLayout 
            title="Budget Planner" 
            subtitle="Take control of your spending with intelligent limits"
            addMarginTop
            rightAction={
                <Button className="btn-premium px-6">
                    <TrendingUp className="size-4 mr-2" />
                    New Budget
                </Button>
            }
        >
            <div className="gsap-reveal space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Budget", amount: `₹${totalBudgetAmount.toLocaleString()}`, icon: Wallet, color: "text-accent-purple" },
                        { label: "Spent So Far", amount: `₹${totalSpentAmount.toLocaleString()}`, icon: TrendingDown, color: "text-rose-500" },
                        { label: "Remaining", amount: `₹${remainingAmount.toLocaleString()}`, icon: PieChart, color: "text-emerald-500" },
                    ].map((item, idx) => (
                        <Card key={idx} className="glass-card">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                                    <h3 className="text-2xl font-black text-white family-outfit">{item.amount}</h3>
                                </div>
                                <div className={`p-4 rounded-2xl bg-white/5 ${item.color}`}>
                                    <item.icon className="size-6" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Detailed Budget Items */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent/80 pl-2">Active Budgets</h4>
                    {liveBudgets.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                             <Wallet className="size-16 text-slate-700 mx-auto mb-4" />
                             <p className="text-slate-400 font-bold family-outfit">No budgets created yet.</p>
                             <p className="text-xs text-slate-500 family-outfit mt-2 uppercase tracking-widest">Set a limit for your categories to start tracking.</p>
                        </div>
                    ) : (
                        liveBudgets.map((budget, idx) => {
                            // Find spending for this budget's category (if any) or generic category name
                            // Note: Budget model has categoryId or maybe we match by name for simplicity if no categoryId
                            const spent = liveCategories.find(c => c.name.toLowerCase() === budget.period.toLowerCase())?.total || 0; // Temp matching logic
                            const percent = Math.min((spent / budget.amount) * 100, 100);
                            
                            return (
                                <Card key={budget._id} className="glass-card overflow-hidden group">
                                    <CardContent className="p-0">
                                        <div className="p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-slate-400">
                                                    {budget.period[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white family-outfit tracking-tight">{budget.period}</p>
                                                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">₹{spent.toLocaleString()} of ₹{budget.amount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 text-right">
                                                <div>
                                                    <p className="text-xs font-black text-white family-outfit">{percent.toFixed(0)}%</p>
                                                    <p className="text-[10px] font-medium text-slate-500 uppercase">Utilized</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                                                    <ArrowUpRight className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                                className={`h-full ${percent > 90 ? 'bg-rose-500' : 'bg-accent'}`}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default Budget;
