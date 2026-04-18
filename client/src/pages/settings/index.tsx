import PageLayout from "@/components/page-layout";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Palette, ShieldCheck, SlidersHorizontal, HelpCircle } from "lucide-react";

interface ItemPropsType {
  items: {
    title: string;
    href: string;
    icon: any;
  }[];
}

const Settings = () => {
  const sidebarNavItems = [
    { title: "Account", href: PROTECTED_ROUTES.SETTINGS, icon: User },
    { title: "Appearance", href: PROTECTED_ROUTES.SETTINGS_APPEARANCE, icon: Palette },
    { title: "Security", href: PROTECTED_ROUTES.SETTINGS_SECURITY, icon: ShieldCheck },
    { title: "Preferences", href: PROTECTED_ROUTES.SETTINGS_PREFERENCES, icon: SlidersHorizontal },
    { title: "Help & Support", href: PROTECTED_ROUTES.SETTINGS_SUPPORT, icon: HelpCircle },
  ];
  return (
    <PageLayout
      title="Settings"
      subtitle="Manage your account, security, and preferences."
      addMarginTop
    >
      <div className="glass-card gsap-reveal rounded-2xl overflow-hidden">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-0 lg:space-y-0 pb-10">
          {/* Left Sidebar */}
          <aside className="lg:w-56 border-b lg:border-b-0 lg:border-r border-white/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>

          {/* Content */}
          <div className="flex-1 px-8 pt-8 lg:max-w-2xl">
            <motion.div
              key={useLocation().pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

function SidebarNav({ items }: ItemPropsType) {
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible p-4 gap-1">
      {items.map((item, i) => {
        const isActive = pathname === item.href;
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap group",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "size-4 transition-colors",
                  isActive ? "text-primary" : "text-slate-500 group-hover:text-white"
                )}
              />
              {item.title}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}

export default Settings;
