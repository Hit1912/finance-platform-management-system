import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Smartphone, ShieldAlert, History, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { toggleTwoFactorAuth, toggleLoginAlerts } from "@/features/settings/settingsSlice";
import { toast } from "sonner";
import { useState } from "react";

const Security = () => {
    const dispatch = useAppDispatch();
    const { twoFactorAuth, loginAlerts } = useTypedSelector((state) => state.settings);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOutAll = () => {
        setIsSigningOut(true);
        setTimeout(() => {
            setIsSigningOut(false);
            toast.success("Successfully signed out from all other devices");
        }, 1500);
    };

    return (
        <div className="space-y-10">
            <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight text-white family-outfit">Security</h3>
                <p className="text-[13px] font-medium text-slate-400 family-outfit opacity-80">
                    Manage your account security and authentication preferences.
                </p>
            </div>
            
            <div className="grid gap-6">
                {/* Two-Factor Authentication */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-6 border border-white/5 rounded-[24px] bg-white/[0.03] backdrop-blur-xl group transition-all"
                >
                    <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                            <Smartphone className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[15px] font-black tracking-tight text-white family-outfit">Two-Factor Authentication</p>
                            <p className="text-xs font-medium text-slate-500 family-outfit">Add an extra layer of security to your account.</p>
                        </div>
                    </div>
                    <Switch
                        checked={twoFactorAuth}
                        onCheckedChange={() => {
                            dispatch(toggleTwoFactorAuth());
                            toast.success(`2FA ${!twoFactorAuth ? 'Enabled' : 'Disabled'}`);
                        }}
                    />
                </motion.div>

                {/* Login Alerts */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between p-6 border border-white/5 rounded-[24px] bg-white/[0.03] backdrop-blur-xl group transition-all"
                >
                    <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                            <ShieldAlert className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[15px] font-black tracking-tight text-white family-outfit">Login Alerts</p>
                            <p className="text-xs font-medium text-slate-500 family-outfit">Get notified of suspicious login attempts.</p>
                        </div>
                    </div>
                    <Switch
                        checked={loginAlerts}
                        onCheckedChange={() => {
                            dispatch(toggleLoginAlerts());
                            toast.success(`Login alerts ${!loginAlerts ? 'Enabled' : 'Disabled'}`);
                        }}
                    />
                </motion.div>

                {/* Session History */}
                <motion.div
                    whileHover={{ scale: 1.005 }}
                    className="p-8 border border-white/5 rounded-[32px] bg-slate-950/20 backdrop-blur-2xl space-y-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="p-3 rounded-2xl bg-accent/10 text-accent">
                                <History className="size-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[15px] font-black tracking-tight text-white family-outfit">Active Sessions</p>
                                <p className="text-xs font-medium text-slate-500 family-outfit">Device history where you are currently logged in.</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white"
                            onClick={handleSignOutAll}
                            disabled={isSigningOut}
                        >
                            {isSigningOut ? "Processing..." : "Sign out all devices"}
                        </Button>
                    </div>

                    <div className="space-y-4 pt-2 relative z-10">
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-sm font-bold text-slate-200 family-outfit">Windows PC • Chrome</span>
                            </div>
                            <span className="text-[9px] font-black tracking-widest bg-white/10 px-3 py-1 rounded-full text-white uppercase">Current</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl opacity-50 hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-slate-600" />
                                <span className="text-sm font-bold text-slate-200 family-outfit">iPhone 13 • Safari</span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-500 family-outfit">2 hours ago</span>
                        </div>
                    </div>
                </motion.div>

                {/* Password Reset */}
                <div className="p-8 border border-dashed border-white/10 rounded-[32px] flex items-center justify-between group hover:border-accent-purple/30 transition-colors">
                    <div className="space-y-1">
                        <p className="text-[15px] font-black tracking-tight text-white family-outfit">Reset Password</p>
                        <p className="text-xs font-medium text-slate-500 family-outfit">Last changed <span className="text-accent-purple/60">3 months ago</span></p>
                    </div>
                    <Button
                        variant="ghost"
                        className="h-12 px-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent-purple/30 rounded-2xl transition-all group/btn"
                        onClick={() => toast.info("Password reset link sent to your email.")}
                    >
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="size-4 text-accent-purple group-hover/btn:scale-110 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-300 group-hover/btn:text-white transition-colors">Change Password</span>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Security;
