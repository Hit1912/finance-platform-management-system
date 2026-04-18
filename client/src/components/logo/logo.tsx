import { PROTECTED_ROUTES } from "@/routes/common/routePath"
import { GalleryVerticalEnd } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Logo = (props: { url?: string; variant?: "light" | "dark" }) => {
  const isLight = props.variant === "light";

  return (
    <Link to={props.url || PROTECTED_ROUTES.OVERVIEW} className="flex items-center gap-2 group">
      <motion.div
        whileHover={{ scale: 1.15, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        className="bg-accent h-8 w-8 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 transition-all duration-300 bg-gradient-to-br from-accent to-accent/80"
      >
        <GalleryVerticalEnd className="size-5" />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "font-black text-2xl tracking-tighter uppercase",
          isLight ? "text-white" : "text-foreground"
        )}
      >
        DH<span className="text-accent underline decoration-4 underline-offset-1">R</span>
      </motion.span>
    </Link>
  )
}


export default Logo