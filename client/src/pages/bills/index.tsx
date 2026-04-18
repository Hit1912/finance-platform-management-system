import { Receipt, Calendar, Bell, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useGetFinanceOverviewQuery } from "@/features/finance/financeAPI";
import { format } from "date-fns";
import PageLayout from "@/components/page-layout";
import { usePageTransition } from "@/hooks/use-gsap";
import { Card, CardContent } from "@/components/ui/card";

const Bills = () => {
    usePageTransition(".gsap-reveal");
    const { data, isLoading } = useGetFinanceOverviewQuery();

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-accent" /></div>;

    const liveBills = data?.data?.bills || [];
    const totalDue = liveBills.reduce((acc, b) => acc + (b.status !== 'PAID' ? b.amount : 0), 0);
    const pendingCount = liveBills.filter(b => b.status !== 'PAID').length;

    return (
        <PageLayout 
            title="Bills & Subscriptions" 
            subtitle="Never miss a payment with automated bill tracking"
            addMarginTop
            rightAction={
                <Button className="btn-premium px-6">
                    <Calendar className="size-4 mr-2" />
                    Bill Calendar
                </Button>
            }
        >
            <div className="gsap-reveal space-y-8">
                {/* Bill Alerts */}
                <Card className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Bell className="size-6" />
                            </div>
                            <div>
                                <p className="font-black text-white family-outfit tracking-tight">Upcoming Bill Alert</p>
                                <p className="text-xs font-medium text-slate-400 family-outfit">You have {pendingCount} bills totaling ₹{totalDue.toLocaleString()} due this period.</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-amber-500 hover:bg-amber-500/10 font-black uppercase tracking-widest text-[10px]">
                            Review All
                        </Button>
                    </CardContent>
                </Card>

                {/* Bill List */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent/80 pl-2">Schedule</h4>
                    {liveBills.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                             <Receipt className="size-16 text-slate-700 mx-auto mb-4" />
                             <p className="text-slate-400 font-bold family-outfit">No bills scheduled.</p>
                             <p className="text-xs text-slate-500 family-outfit mt-2 uppercase tracking-widest">Add your recurring subscriptions here.</p>
                        </div>
                    ) : (
                        liveBills.map((bill, idx) => (
                            <motion.div
                                key={bill._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="glass-card group hover:bg-white/[0.03] transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className={`size-14 rounded-2xl bg-white/5 flex items-center justify-center ${bill.status === 'OVERDUE' ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                                                    <Receipt className="size-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white family-outfit tracking-tight">{bill.provider}</h4>
                                                    <p className="text-xs font-medium text-slate-500 family-outfit">{bill.type}</p>
                                                </div>
                                            </div>
    
                                            <div className="flex items-center gap-10">
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-white family-outfit">₹{bill.amount.toLocaleString()}</p>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${bill.status === 'OVERDUE' ? 'text-rose-500' : 'text-slate-500'}`}>{format(new Date(bill.dueDate), "MMM dd")}</p>
                                                </div>
                                                <Button 
                                                    className={`h-11 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                                                        bill.status === 'PAID' 
                                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                                        : 'bg-white/5 text-white hover:bg-accent hover:text-white border border-white/10'
                                                    }`}
                                                >
                                                    {bill.status === 'PAID' ? 'Paid' : 'Pay Now'}
                                                    {bill.status !== 'PAID' && <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default Bills;
