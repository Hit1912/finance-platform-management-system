import { AppearanceTheme } from "./_components/appearance-theme"

const Appearance = () => {
  return (
    <div className="space-y-12">
        <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight text-white family-outfit">Appearance</h3>
            <p className="text-[13px] font-medium text-slate-400 family-outfit opacity-80">
                Customize the appearance of the app. Automatically switch between day and night themes.
            </p>
        </div>
        
        <AppearanceTheme />
    </div>
  )
}

export default Appearance