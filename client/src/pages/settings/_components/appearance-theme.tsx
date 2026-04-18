import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "@/context/theme-provider"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppearanceTheme() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (value: "light" | "dark") => {
    setTheme(value)
  }

  return (
    <div className="space-y-8 min-h-[400px]">
      <div className="space-y-4">
        <div>
          <h4 className="text-xl font-black text-foreground tracking-tight">System Appearance</h4>
          <p className="text-sm text-muted-foreground font-medium">
            Choose your preferred interface style. Your preference will be saved automatically.
          </p>
        </div>

        <RadioGroup
          value={theme}
          onValueChange={handleThemeChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
        >
          {/* Light Theme Option */}
          <div className="relative">
            <RadioGroupItem value="light" id="light" className="sr-only" />
            <Label
              htmlFor="light"
              className={cn(
                "flex flex-col gap-3 cursor-pointer group rounded-2xl p-4 transition-all duration-300 border-2",
                theme === "light" 
                  ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
                  : "bg-muted/50 border-border hover:border-primary/50 hover:bg-muted"
              )}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 p-2 border border-border">
                <div className="space-y-2 rounded-lg bg-white p-3 shadow-sm h-full">
                  <div className="space-y-2">
                    <div className="h-2 w-2/3 rounded-full bg-slate-100" />
                    <div className="h-2 w-full rounded-full bg-slate-100" />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-6 w-6 rounded-full bg-indigo-500/20" />
                    <div className="h-2 w-1/2 rounded-full bg-slate-100" />
                  </div>
                </div>
                {theme === "light" && (
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center backdrop-blur-[1px]">
                     <div className="bg-primary text-white p-1 rounded-full shadow-lg">
                        <Check className="size-4" />
                     </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-foreground">Light Mode</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Azure Frost</span>
              </div>
            </Label>
          </div>

          {/* Dark Theme Option */}
          <div className="relative">
            <RadioGroupItem value="dark" id="dark" className="sr-only" />
            <Label
              htmlFor="dark"
              className={cn(
                "flex flex-col gap-3 cursor-pointer group rounded-2xl p-4 transition-all duration-300 border-2",
                theme === "dark" 
                  ? "bg-white/10 border-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                  : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
              )}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 p-2 border border-white/10">
                <div className="space-y-2 rounded-lg bg-slate-950 p-3 shadow-sm h-full border border-white/5">
                   <div className="space-y-2">
                    <div className="h-2 w-2/3 rounded-full bg-slate-800" />
                    <div className="h-2 w-full rounded-full bg-slate-800" />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-6 w-6 rounded-full bg-primary/30" />
                    <div className="h-2 w-1/2 rounded-full bg-slate-800" />
                  </div>
                </div>
                {theme === "dark" && (
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center backdrop-blur-[1px]">
                     <div className="bg-primary text-white p-1 rounded-full shadow-lg">
                        <Check className="size-4" />
                     </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-foreground">Dark Mode</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-primary">Cyber Neon</span>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}