import PageLayout from "@/components/page-layout";
import { usePageTransition } from "@/hooks/use-gsap";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, Plus, Zap, Heart, ShoppingBag, Coffee, Car, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useGetFinanceOverviewQuery } from "@/features/finance/financeAPI";

const Categories = () => {
    usePageTransition(".gsap-reveal");
    const { data, isLoading } = useGetFinanceOverviewQuery();

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-accent" /></div>;

    const liveCategories = data?.data?.categories || [];

    // Fallback icons map
    const iconMap: any = {
        "Housing": LayoutGrid,
        "Utilities": Zap,
        "Healthcare": Heart,
        "Shopping": ShoppingBag,
        "Food & Drink": Coffee,
        "Transport": Car,
        "Entertainment": LayoutGrid
    };

    return (
        <PageLayout 
            title="Categories" 
            subtitle="Organize your financial transactions with precision"
            addMarginTop
            rightAction={
                <Button className="btn-premium px-6">
                    <Plus className="size-4 mr-2" />
                    Add Category
                </Button>
            }
        >
            <div className="gsap-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveCategories.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                         <LayoutGrid className="size-16 text-slate-700 mx-auto mb-4" />
                         <p className="text-slate-400 font-bold family-outfit">No active categories found for this period.</p>
                         <p className="text-xs text-slate-500 family-outfit">Add transactions to see your spending taxonomy here.</p>
                    </div>
                ) : (
                    liveCategories.map((cat, idx) => {
                        const Icon = iconMap[cat.name] || LayoutGrid;
                        return (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="glass-card group hover:scale-[1.02] transition-all duration-500">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-4 rounded-2xl bg-accent/10 text-accent group-hover:scale-110 transition-transform`}>
                                                    <Icon className="size-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black tracking-tight family-outfit text-white">{cat.name}</h4>
                                                    <p className="text-xs font-medium text-slate-500 family-outfit">{cat.count} Transactions</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-white family-outfit">₹{cat.total.toLocaleString()}</p>
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Spent</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-accent opacity-50" 
                                                style={{ width: `${Math.min((cat.total / 10000) * 100, 100)}%` }} 
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </PageLayout>
    );
};

export default Categories;
