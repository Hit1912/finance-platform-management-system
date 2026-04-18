import PageLayout from "@/components/page-layout";
import { usePageTransition } from "@/hooks/use-gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useGetFinanceOverviewQuery } from "@/features/finance/financeAPI";

const Goals = () => {
    usePageTransition(".gsap-reveal");
    const { data, isLoading } = useGetFinanceOverviewQuery();

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-accent" /></div>;

    const liveGoals = data?.data?.goals || [];

    return (
        <PageLayout 
            title="Financial Goals" 
            subtitle="Turn your dreams into reality with targeted savings"
            addMarginTop
            rightAction={
                <Button className="btn-premium px-6">
                    <Plus className="size-4 mr-2" />
                    New Goal
                </Button>
            }
        >
            <div className="gsap-reveal grid grid-cols-1 lg:grid-cols-2 gap-8">
                {liveGoals.length === 0 ? (
                    <Card className="glass-card lg:col-span-2 overflow-hidden relative group py-20 text-center border-dashed border-2">
                        <Trophy className="size-20 text-slate-800 mx-auto mb-4" />
                        <h2 className="text-xl font-black text-slate-500 family-outfit">No active goals found</h2>
                        <p className="text-xs text-slate-600 family-outfit mt-1">Start by creating your first wealth mission.</p>
                        <Button className="btn-premium mt-6 h-10 px-8">Define Your Future</Button>
                    </Card>
                ) : (
                    liveGoals.map((goal, idx) => {
                        const target = goal.targetAmount || 1; // Prevent division by zero
                        const percent = Math.min((goal.currentAmount / target) * 100, 100);
                        return (
                            <Card key={goal._id} className="glass-card group hover:bg-white/[0.04] transition-all relative overflow-hidden">
                                {idx === 0 && (
                                     <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                        <Trophy className="size-32 text-accent-purple" />
                                    </div>
                                )}
                                <CardContent className="p-8 space-y-6 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent">
                                                <Target className="size-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-white family-outfit tracking-tight">{goal.name}</h4>
                                                <p className="text-xs font-medium text-slate-500 family-outfit">₹{goal.currentAmount.toLocaleString()} saved</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-white family-outfit">{percent.toFixed(0)}%</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                className="h-full bg-gradient-to-r from-accent to-accent-purple"
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            <span>Progress</span>
                                            <span>Target: ₹{goal.targetAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </PageLayout>
    );
};

export default Goals;
