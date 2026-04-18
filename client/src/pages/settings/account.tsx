import { AccountForm } from "./_components/account-form"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2, UserMinus } from "lucide-react"
import { useDeleteAccountMutation } from "@/features/user/userAPI"
import { useAppDispatch } from "@/app/hook"
import { logout } from "@/features/auth/authSlice"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { AUTH_ROUTES } from "@/routes/common/routePath"
import { motion } from "framer-motion"

const Account = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? This action is irreversible and all your data (transactions, reports) will be permanently deleted."
    );

    if (confirmed) {
      try {
        const response: any = await deleteAccount().unwrap();
        toast.success(response.message || "Account deleted successfully");
        dispatch(logout());
        navigate(AUTH_ROUTES.SIGN_IN);
      } catch (error: any) {
        toast.error(error.data?.message || "Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-1">
        <h3 className="text-2xl font-black tracking-tight text-white family-outfit">Account</h3>
        <p className="text-[13px] font-medium text-slate-400 family-outfit opacity-80">
          Update your account settings and manage your profile.
        </p>
      </div>
      
      <AccountForm />

      <div className="pt-8">
        <motion.div 
            whileHover={{ scale: 1.005 }}
            className="space-y-6 rounded-[32px] border border-red-500/10 bg-red-500/[0.02] backdrop-blur-xl p-8 transition-colors hover:bg-red-500/[0.03]"
        >
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-3">
              <AlertTriangle className="size-4" /> Danger Zone
            </h4>
            <div className="space-y-1 pl-7">
                <p className="text-sm font-bold text-slate-200 family-outfit">Delete Account</p>
                <p className="text-xs font-medium text-slate-500 family-outfit max-w-md">
                    Irreversibly delete your account and all associated data. Once deleted, your financial history cannot be recovered.
                </p>
            </div>
          </div>
          <div className="pl-7">
            <Button
                variant="ghost"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="h-11 px-6 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <UserMinus className="mr-2 h-4 w-4" />
                )}
                Permanently Delete Account
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Account