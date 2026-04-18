import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Globe, Coins, Mail, CalendarDays, Wallet, Target, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import {
    setCurrency,
    setLanguage,
    toggleEmailReports,
    togglePushNotifications,
    toggleShowDecimals,
    setDateFormat,
    setWeekStart,
    setBudgetThreshold,
    setMonthlyBudgetGoal
} from "@/features/settings/settingsSlice";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Preferences = () => {
    const dispatch = useAppDispatch();
    const {
        currency,
        language,
        showDecimals,
        emailReports,
        pushNotifications,
        dateFormat,
        weekStart,
        budgetThreshold,
        monthlyBudgetGoal
    } = useTypedSelector((state) => state.settings);

    const handleCurrencyChange = (value: string) => {
        dispatch(setCurrency(value));
        toast.success(`Currency changed to ${value}`);
    };

    const handleLanguageChange = (value: string) => {
        dispatch(setLanguage(value));
        const langMap: Record<string, string> = { en: "English", hi: "Hindi", gu: "Gujarati" };
        toast.success(`Language set to ${langMap[value] || value}`);
    };

    const SettingItem = ({ icon: Icon, title, desc, children, iconBg = "bg-accent/10", iconColor = "text-accent" }: any) => (
        <motion.div 
            whileHover={{ x: 5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-white/5 rounded-[24px] bg-white/[0.03] backdrop-blur-xl transition-all"
        >
            <div className="flex items-center gap-5">
                <div className={`p-3 rounded-2xl ${iconBg} ${iconColor}`}>
                    <Icon className="size-5" />
                </div>
                <div className="space-y-1">
                    <p className="text-[15px] font-black tracking-tight text-white family-outfit">{title}</p>
                    <p className="text-xs font-medium text-slate-500 family-outfit">{desc}</p>
                </div>
            </div>
            <div className="min-w-[140px] flex justify-end">
                {children}
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-12">
            <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight text-white family-outfit">Preferences</h3>
                <p className="text-[13px] font-medium text-slate-400 family-outfit opacity-80">
                    Manage your regional settings and notification preferences.
                </p>
            </div>

            <div className="grid gap-10">
                {/* Regional Settings */}
                <div className="space-y-5">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-500/80 pl-2">Regional & Localization</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SettingItem title="Currency" desc="Default display currency" icon={Coins} iconBg="bg-amber-500/10" iconColor="text-amber-500">
                             <Select value={currency} onValueChange={handleCurrencyChange}>
                                <SelectTrigger className="h-10 bg-white/5 border-white/10 rounded-xl family-outfit font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                                    <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                                </SelectContent>
                            </Select>
                        </SettingItem>
                        <SettingItem title="Language" desc="Interface language" icon={Globe} iconBg="bg-blue-500/10" iconColor="text-blue-500">
                             <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="h-10 bg-white/5 border-white/10 rounded-xl family-outfit font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English (US)</SelectItem>
                                    <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                                    <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                                </SelectContent>
                            </Select>
                        </SettingItem>
                    </div>
                </div>

                {/* Date & Time Settings */}
                <div className="space-y-5">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-500/80 pl-2">Date & Time Formats</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SettingItem title="Date Format" desc="How dates are displayed" icon={CalendarDays} iconBg="bg-cyan-500/10" iconColor="text-cyan-500">
                             <Select value={dateFormat} onValueChange={(v) => dispatch(setDateFormat(v))}>
                                <SelectTrigger className="h-10 bg-white/5 border-white/10 rounded-xl family-outfit font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                </SelectContent>
                            </Select>
                        </SettingItem>
                        <SettingItem title="Week Start" desc="First day of calendar" icon={Target} iconBg="bg-indigo-500/10" iconColor="text-indigo-500">
                             <Select value={weekStart} onValueChange={(v) => dispatch(setWeekStart(v))}>
                                <SelectTrigger className="h-10 bg-white/5 border-white/10 rounded-xl family-outfit font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monday">Monday</SelectItem>
                                    <SelectItem value="sunday">Sunday</SelectItem>
                                </SelectContent>
                            </Select>
                        </SettingItem>
                    </div>
                </div>

                {/* Budgeting Settings */}
                <div className="space-y-5">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-accent-purple/80 pl-2">Financial Goals</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SettingItem title="Monthly Budget" desc="Target spending limit" icon={Wallet} iconBg="bg-accent-purple/10" iconColor="text-accent-purple">
                            <Input
                                type="number"
                                value={monthlyBudgetGoal}
                                onChange={(e) => dispatch(setMonthlyBudgetGoal(Number(e.target.value)))}
                                className="h-10 w-32 bg-white/5 border-white/10 rounded-xl family-outfit font-bold text-right"
                            />
                        </SettingItem>
                        <SettingItem title="Low Balance Alert" desc="Warning threshold" icon={AlertTriangle} iconBg="bg-rose-500/10" iconColor="text-rose-500">
                            <Input
                                type="number"
                                value={budgetThreshold}
                                onChange={(e) => dispatch(setBudgetThreshold(Number(e.target.value)))}
                                className="h-10 w-32 bg-white/5 border-white/10 rounded-xl family-outfit font-bold text-right"
                            />
                        </SettingItem>
                    </div>
                </div>

                {/* Notifications & Display */}
                <div className="space-y-5">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500/80 pl-2">Notifications & Interface</h4>
                    <div className="grid gap-4">
                        <SettingItem title="Email Reports" desc="Weekly spending summaries" icon={Mail} iconBg="bg-emerald-500/10" iconColor="text-emerald-500">
                            <Switch checked={emailReports} onCheckedChange={() => dispatch(toggleEmailReports())} />
                        </SettingItem>
                        <SettingItem title="Push Notifications" desc="Real-time alert system" icon={Bell} iconBg="bg-blue-500/10" iconColor="text-blue-500">
                            <Switch checked={pushNotifications} onCheckedChange={() => dispatch(togglePushNotifications())} />
                        </SettingItem>
                        <SettingItem title="Precise Amounts" desc="Show decimal places" icon={Coins} iconBg="bg-slate-500/10" iconColor="text-slate-400">
                            <Switch checked={showDecimals} onCheckedChange={() => dispatch(toggleShowDecimals())} />
                        </SettingItem>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preferences;
