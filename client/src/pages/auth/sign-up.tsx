import SignUpForm from "./_component/signup-form";
import Logo from "@/components/logo/logo";
import { motion } from "framer-motion";
import { Users, Zap, BarChart3, Sparkles } from "lucide-react";

const features = [
  { icon: Users, label: "Community Insights", desc: "See how your spending compares with peers" },
  { icon: Zap, label: "Instant Categorization", desc: "Automated AI tagging for every transaction" },
  { icon: BarChart3, label: "Wealth Tracking", desc: "Watch your net worth grow with smart projections" },
];

const SignUp = () => {
  return (
    <div className="min-h-screen bg-[#020617] mesh-bg flex overflow-hidden relative">
      {/* Animated background orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.35, 0.2],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-indigo-600/25 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, -40, 0],
          y: [0, 60, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-violet-600/20 blur-[130px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[25%] w-[35%] h-[35%] bg-blue-500/10 blur-[90px] rounded-full pointer-events-none"
      />

      {/* Left Panel — Form */}
      <div className="flex flex-col w-full lg:w-1/2 p-8 md:p-12 relative z-10 justify-between">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Logo url="/" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-white glow-text">Create an account</h1>
              <p className="text-slate-400 mt-2 text-sm">Start your journey to financial freedom today</p>
            </div>
            <SignUpForm />
          </div>
        </motion.div>

        <p className="text-center text-xs text-slate-600">
          © {new Date().getFullYear()} DHR. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Feature Showcase */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative"
      >
        {/* Glass card */}
        <div className="relative bg-white/3 backdrop-blur-xl border border-white/8 rounded-3xl p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 blur-3xl rounded-full" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="size-3" />
              Join 10,000+ Smart Investors
            </div>

            <h2 className="text-4xl font-bold text-white leading-snug tracking-tight mb-4">
              Intelligence in every{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                transaction
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              Stop wondering where your money goes. Build a lasting legacy with our advanced financial ecosystem.
            </p>

            <div className="space-y-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all duration-300">
                    <f.icon className="size-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;