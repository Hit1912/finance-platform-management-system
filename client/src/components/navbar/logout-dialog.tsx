import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent,DialogDescription } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";

interface LogoutDialogProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const LogoutDialog = ({ isOpen, setIsOpen }: LogoutDialogProps) => {
    const [isPending, startTransition] = useTransition();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
      startTransition(() => {
        setIsOpen(false);
        dispatch(logout());
        navigate(AUTH_ROUTES.SIGN_IN);
      });
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md !bg-background/95 !backdrop-blur-2xl border-border shadow-2xl overflow-hidden rounded-[32px]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-destructive/10 blur-[80px] rounded-full pointer-events-none" />
                <DialogHeader className="space-y-4 pb-4">
                    <DialogTitle className="text-3xl font-black tracking-tighter text-foreground leading-tight">
                        Confirm <span className="text-destructive">Logout</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm font-semibold leading-relaxed tracking-wide">
                        Are you sure you want to end your session? Your progress will be saved, but you'll need to re-authenticate.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row gap-3 sm:justify-end border-t border-border pt-6 mt-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => setIsOpen(false)}
                        className="flex-1 sm:flex-none border border-border hover:bg-secondary text-muted-foreground hover:text-foreground rounded-2xl h-12 px-8 font-bold uppercase tracking-widest text-[10px]"
                    >
                        Stay Signed In
                    </Button>
                    <Button 
                        disabled={isPending} 
                        onClick={handleLogout}
                        className="flex-1 sm:flex-none h-12 px-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0 rounded-2xl transition-all duration-300 shadow-xl shadow-destructive/20 font-black uppercase tracking-widest text-[10px]"
                    >
                        {isPending ? (
                            <Loader className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Exit Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LogoutDialog