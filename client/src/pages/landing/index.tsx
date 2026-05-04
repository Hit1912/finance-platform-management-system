import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  PieChart, 
  Target, 
  CreditCard 
} from "lucide-react";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <span className="text-xl font-black italic">D</span>
            </div>
            <span className="text-xl font-black tracking-tight family-outfit">DHR Finance</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to={AUTH_ROUTES.SIGN_IN}>
              <Button variant="ghost" className="text-slate-400 hover:text-white font-bold">Login</Button>
            </Link>
            <Link to={AUTH_ROUTES.SIGN_UP}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-4 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
              Next-Gen Wealth Management
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter family-outfit leading-[0.9] mb-8">
              Take Control of Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Financial Future.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 family-outfit font-medium">
              Track expenses, set goals, and gain deep insights into your spending habits with our AI-powered personal finance platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={AUTH_ROUTES.SIGN_UP}>
                <Button className="h-16 px-10 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-[0_20px_40px_rgba(79,70,229,0.25)] group">
                  Start Free Trial
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={AUTH_ROUTES.SIGN_IN}>
                <Button variant="outline" className="h-16 px-10 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image / Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <div className="rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
               <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                alt="Dashboard Mockup" 
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight family-outfit mb-4">Powerful Features for Smart Money</h2>
            <p className="text-slate-400 font-medium">Everything you need to master your personal economy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="size-8 text-indigo-400" />,
                title: "Advanced Analytics",
                desc: "Deep dive into your spending patterns with interactive charts and automated categorization."
              },
              {
                icon: <Zap className="size-8 text-amber-400" />,
                title: "AI Receipt Scan",
                desc: "Snap a photo of your receipt and let our AI automatically extract and categorize the data."
              },
              {
                icon: <ShieldCheck className="size-8 text-emerald-400" />,
                title: "Military-Grade Security",
                desc: "Your data is encrypted with 256-bit AES encryption. Your privacy is our top priority."
              },
              {
                icon: <PieChart className="size-8 text-pink-400" />,
                title: "Budget Planning",
                desc: "Set monthly limits and receive real-time notifications when you're close to reaching them."
              },
              {
                icon: <Target className="size-8 text-cyan-400" />,
                title: "Goal Tracking",
                desc: "Save for a new car or your dream home. Visualize your progress and stay motivated."
              },
              {
                icon: <CreditCard className="size-8 text-violet-400" />,
                title: "Bill Reminders",
                desc: "Never miss a payment again. Get automated reminders before your bills are due."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group"
              >
                <div className="size-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-3 family-outfit">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-10">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-lg font-black italic">D</span>
            </div>
            <span className="text-lg font-black tracking-tight family-outfit">DHR Finance</span>
          </div>
          <div className="flex items-center gap-10 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="text-slate-600 text-sm">© 2026 DHR Finance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
