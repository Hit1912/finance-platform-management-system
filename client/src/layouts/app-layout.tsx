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

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  usePageTransition(".gsap-fade-in");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Immersive Effects */}
      <Scene3D />
      <AmbientOrbs />
      <ParticleField />
      <CursorGlow />

      {/* Persistence Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Container */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 relative z-10",
          isCollapsed ? "pl-20" : "pl-20 lg:pl-64"
        )}
      >
        <Navbar />
        
        <main className="flex-1 p-4 max-w-[1600px] mx-auto w-full gsap-fade-in">
          <Outlet />
        </main>
      </div>

      <EditTransactionDrawer />
    </div>
  );
};



export default AppLayout;
