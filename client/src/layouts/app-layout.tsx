import { useState } from "react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";
import { Scene3D } from "@/components/effects/scene-3d";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { AmbientOrbs } from "@/components/effects/ambient-orbs";
import { ParticleField } from "@/components/effects/particle-field";
import { usePageTransition } from "@/hooks/use-gsap";

import { useIsMobile } from "@/hooks/use-mobile";
import MobileNav from "@/components/navbar/mobile-nav";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  usePageTransition(".gsap-fade-in");

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Immersive Effects */}
      <Scene3D />
      <AmbientOrbs />
      <ParticleField />
      <CursorGlow />

      {/* Persistence Sidebar - Only show on desktop */}
      {!isMobile && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}

      {/* Main Container */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 relative z-10 w-full",
          isMobile ? "pl-0 pb-20" : (isCollapsed ? "pl-20" : "pl-20 lg:pl-64")
        )}
      >
        <Navbar />
        
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full gsap-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileNav />}

      <EditTransactionDrawer />
    </div>
  );
};



export default AppLayout;
