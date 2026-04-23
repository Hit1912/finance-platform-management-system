import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "@/app/hook";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "@/features/settings/settingsSlice";
import { useNavigate } from "react-router-dom";

import Logo from "../logo/logo";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { user } = useTypedSelector((state) => state.auth);
  const { searchTerm } = useTypedSelector((state) => state.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchValue, setSearchValue] = useState("");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sync local search with global search (e.g. if cleared from elsewhere)
  useEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const performSearch = (term: string) => {
    const cleanTerm = term.toLowerCase().trim();
    
    // Command Mapping
    const commands: Record<string, string> = {
      "setting": "/settings",
      "settings": "/settings",
      "overview": "/overview",
      "dashboard": "/overview",
      "report": "/reports",
      "reports": "/reports",
      "transaction": "/transactions",
      "transactions": "/transactions",
      "history": "/transactions",
      "categories": "/categories",
      "category": "/categories",
      "budget": "/budget",
      "budgets": "/budget",
      "goals": "/goals",
      "goal": "/goals",
      "bills": "/bills",
      "bill": "/bills",
      "subscription": "/bills",
    };

    if (commands[cleanTerm]) {
      navigate(commands[cleanTerm]);
    } else {
      navigate(`/transactions?keyword=${encodeURIComponent(term)}`);
    }
    
    dispatch(setSearchTerm(""));
    setSearchValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      performSearch(searchValue);
    }
  };

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      performSearch(searchValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    // Optional: Only update Redux as you type if we are already on the Transactions page
    if (window.location.pathname === "/transactions") {
      dispatch(setSearchTerm(value));
    }
  };

  return (
    <>
      <header
        className={cn(
          "w-full h-16 sticky top-0 z-40 transition-all duration-300",
          "bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl",
          scrolled && "border-accent-purple/20 bg-slate-950/90"
        )}
      >
        <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4">
          {/* Logo for mobile */}
          {isMobile && <Logo variant="light" className="scale-75 -ml-2" />}

          {/* Left - Search */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative group">
              <button 
                onClick={handleSearchClick}
                className="absolute left-4 top-1/2 -translate-y-1/2 group-hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Search className="size-4 text-slate-500 group-focus-within:text-accent group-focus-within:animate-pulse transition-all" />
              </button>
              <input
                type="text"
                placeholder="Search budget, goals, transactions..."
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full h-11 pl-12 pr-4 bg-white/5 border border-white/5 rounded-[14px] text-sm font-black tracking-tight text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/40 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Right - Notifications & User */}
          <div className="flex items-center gap-4 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:bg-secondary/80 rounded-xl"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 size-2 bg-accent rounded-full border-2 border-background shadow-[0_0_8px_rgba(var(--accent),0.5)]" />
            </Button>

            <div className="h-8 w-px bg-border/50 mx-1" />

            <UserNav
              userName={user?.name || ""}
              profilePicture={user?.profilePicture || ""}
              onLogout={() => setIsLogoutDialogOpen(true)}
            />
          </div>
        </div>
      </header>

      <LogoutDialog isOpen={isLogoutDialogOpen} setIsOpen={setIsLogoutDialogOpen} />
    </>
  );
};

export default Navbar;
