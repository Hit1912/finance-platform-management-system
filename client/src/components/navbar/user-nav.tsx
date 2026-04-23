import { ChevronDown, LogOut } from "lucide-react"
import { Link } from "react-router-dom"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "../ui/avatar"
  import { Button } from "../ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
        DropdownMenuTrigger,
  } from "../ui/dropdown-menu"
  
export function UserNav({
  userName,
  profilePicture,
  onLogout,
}: {
  userName: string;
  profilePicture: string;
  onLogout: () => void;
}) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative group flex items-center gap-2 h-10 px-2 rounded-xl hover:bg-secondary/50 transition-all duration-300"
        >
          <div className="relative">
            <Avatar className="h-8 w-8 ring-2 ring-border/50 group-hover:ring-accent transition-all">
              <AvatarImage
                src={profilePicture || ""}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground uppercase">
                {userName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-success rounded-full border-2 border-background shadow-[0_0_8px_rgba(var(--success),0.5)]" />
          </div>
          <ChevronDown className="size-3 text-muted-foreground group-hover:text-foreground transition-colors ml-0.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 p-0 mt-3 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-950/95 backdrop-blur-2xl rounded-[32px] overflow-hidden animate-in fade-in zoom-in-95 duration-500"
        align="end"
        sideOffset={12}
      >
        <DropdownMenuLabel className="px-8 pt-10 pb-8 flex flex-col gap-2 relative overflow-hidden bg-white/[0.03]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-purple/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-2.5">
            <div className="size-1.5 rounded-full bg-success shadow-[0_0_10px_rgba(var(--success),1)] animate-pulse" />
            <span className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-[0.2em]">Authorized Session</span>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter leading-none mt-2">{userName}</p>
        </DropdownMenuLabel>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <Link to="/reports" className="block">
               <Button variant="outline" className="w-full h-14 bg-accent text-white border-0 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-accent/90 hover:scale-[1.02] transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-widest opacity-60">Reports</span>
                  <span className="relative z-10 text-[11px] font-black uppercase tracking-widest">Generate Now</span>
               </Button>
             </Link>
             <Link to="/settings" className="block">
               <Button variant="outline" className="h-14 w-full bg-accent-purple text-white border-0 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-accent-purple/90 hover:scale-[1.02] transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-widest opacity-60">System</span>
                  <span className="relative z-10 text-[11px] font-black uppercase tracking-widest">Settings</span>
               </Button>
             </Link>
          </div>

          <DropdownMenuSeparator className="bg-white/5" />

          <DropdownMenuItem 
            className="flex items-center justify-between h-14 px-6 rounded-2xl cursor-pointer bg-white/5 border border-white/5 hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-all duration-300 group"
            onSelect={(e) => {
              e.preventDefault();
              onLogout();
            }}
          >
            <div className="flex items-center gap-3">
               <LogOut className="size-4 text-rose-500 group-hover:text-white transition-colors" />
               <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 group-hover:text-white transition-colors">Terminate Session</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-40">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
    );
  }