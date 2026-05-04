import { NavLink } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  PieChart,
  Trophy,
  Receipt
} from "lucide-react";
import Logo from "../logo/logo";
import { Button } from "../ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: PROTECTED_ROUTES.OVERVIEW },
  { icon: ArrowLeftRight, label: "Transactions", path: PROTECTED_ROUTES.TRANSACTIONS },
  { icon: BarChart3, label: "Reports", path: PROTECTED_ROUTES.REPORTS },
  { icon: LayoutGrid, label: "Categories", path: PROTECTED_ROUTES.CATEGORIES },
  { icon: PieChart, label: "Budget", path: PROTECTED_ROUTES.BUDGET },
  { icon: Trophy, label: "Goals", path: PROTECTED_ROUTES.GOALS },
  { icon: Receipt, label: "Bills", path: PROTECTED_ROUTES.BILLS },
  { icon: Settings, label: "Settings", path: PROTECTED_ROUTES.SETTINGS },
];

export const Sidebar = ({ 
  isCollapsed, 
  setIsCollapsed,
  isMobile = false,
  onClose
}: { 
  isCollapsed: boolean; 
  setIsCollapsed: (val: boolean) => void;
  isMobile?: boolean;
  onClose?: () => void;
}) => {

  return (
    <aside 
      className={cn(
        "sidebar-bg text-white transition-all duration-300 ease-in-out border-r border-white/5",
        !isMobile ? "h-screen fixed left-0 top-0 z-50" : "h-full w-full border-r-0",
        isCollapsed ? "w-20" : "w-64",
        isMobile && "w-full"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 mb-4 mt-2 justify-between">
          {!isCollapsed && <Logo variant="light" />}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white hover:bg-white/10"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && onClose?.()}
              className={({ isActive }) => cn(
                "group flex items-center px-3 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                isActive 
                  ? "sidebar-item-active shadow-lg shadow-accent/20" 
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className={cn(
                "flex-shrink-0 size-5 transition-colors",
                "group-hover:text-accent"
              )} />
              {!isCollapsed && (
                <span className="ml-3 truncate tracking-wide">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer (Optional) */}
        <div className="p-4 border-t border-white/5">
           {!isCollapsed && (
             <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
               <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black mb-1">Account Tier</p>
               <p className="text-xs font-black text-accent uppercase tracking-wider">Professional Plan</p>
             </div>
           )}
        </div>
      </div>
    </aside>
  );
};
