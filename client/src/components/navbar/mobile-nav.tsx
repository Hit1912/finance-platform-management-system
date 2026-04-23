import { NavLink } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  BarChart3, 
  PieChart,
  Plus
} from "lucide-react";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";

const mobileMenuItems = [
  { icon: LayoutDashboard, label: "Home", path: PROTECTED_ROUTES.OVERVIEW },
  { icon: ArrowLeftRight, label: "Transactions", path: PROTECTED_ROUTES.TRANSACTIONS },
  { icon: BarChart3, label: "Reports", path: PROTECTED_ROUTES.REPORTS },
  { icon: PieChart, label: "Budget", path: PROTECTED_ROUTES.BUDGET },
];

const MobileNav = () => {
  const { onOpenDrawer } = useEditTransactionDrawer();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-slate-950/80 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around h-20 px-2">
        {mobileMenuItems.slice(0, 2).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300 px-2",
              isActive ? "text-accent" : "text-white/40 hover:text-white/60"
            )}
          >
            <item.icon className="size-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </NavLink>
        ))}

        {/* Floating Action Button for New Transaction */}
        <button 
          onClick={() => onOpenDrawer("")}
          className="relative -top-8 size-14 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/40 text-slate-950 hover:scale-110 transition-transform active:scale-95"
        >
          <Plus className="size-8" />
        </button>

        {mobileMenuItems.slice(2).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300 px-2",
              isActive ? "text-accent" : "text-white/40 hover:text-white/60"
            )}
          >
            <item.icon className="size-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
