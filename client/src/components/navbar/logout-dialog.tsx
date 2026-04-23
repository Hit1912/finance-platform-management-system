import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Loader, LogOut, X } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { motion } from "framer-motion";

interface LogoutDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const LogoutDialog = ({ isOpen, setIsOpen }: LogoutDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useTypedSelector((state) => state.auth);

  const handleLogout = () => {
    startTransition(() => {
      setIsOpen(false);
      dispatch(logout());
      navigate(AUTH_ROUTES.SIGN_IN);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        hideClose={true}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[440px] p-0 !bg-slate-950/40 !backdrop-blur-[40px] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden rounded-[40px] border border-white/5 z-[100]"
      >
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/20 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 p-10 flex flex-col items-center text-center">
          {/* Header Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="size-20 rounded-[30px] bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
          >
            <LogOut className="size-10 text-red-500" />
          </motion.div>

          <DialogHeader className="space-y-3 pb-8 w-full">
            <DialogTitle className="text-4xl font-black tracking-tight text-white family-outfit leading-tight">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-base font-medium leading-relaxed family-outfit max-w-[300px] mx-auto">
              Goodbye, <span className="text-white font-black">{user?.name || "User"}</span>! Are you sure you want to end your session?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 w-full">
            <Button
              disabled={isPending}
              onClick={handleLogout}
              className="h-16 w-full bg-red-500 hover:bg-red-600 text-white border-0 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(239,68,68,0.4)] font-black uppercase tracking-[0.2em] text-xs group"
            >
              {isPending ? (
                <Loader className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
              )}
              Exit Account
            </Button>

            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-16 w-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
            >
              Stay Signed In
            </Button>
          </div>
        </div>

        {/* Custom Close Button */}
        <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all z-20 border border-white/5"
        >
            <X className="size-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;