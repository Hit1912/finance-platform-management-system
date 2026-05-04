import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  PieChart, 
  Target, 
  CreditCard,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { Button } from "@/components/ui/button";

// --- 3D Background Components ---

const AnimatedSphere = () => {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color="#4f46e5"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
};

const Background3D = () => {
  return (
    <div className="absolute inset-0 -z-10 h-[800px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <group position={[2.5, 0, 0]}>
            <AnimatedSphere />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

// --- Interactive 3D Card ---

const FeatureCard = ({ icon, title, desc, delay }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className="p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-colors group relative overflow-hidden"
      >
        <div 
           style={{ transform: "translateZ(50px)" }}
           className="size-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(79,70,229,0.2)]"
        >
          {icon}
        </div>
        <h3 style={{ transform: "translateZ(40px)" }} className="text-xl font-black mb-3 family-outfit">{title}</h3>
        <p style={{ transform: "translateZ(30px)" }} className="text-slate-400 text-sm leading-relaxed font-medium">
          {desc}
        </p>
        
        {/* Glow effect on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </motion.div>
  );
};

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <Background3D />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <span className="text-xl font-black italic">D</span>
            </div>
            <span className="text-xl font-black tracking-tight family-outfit hidden sm:inline">DHR Finance</span>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link to={AUTH_ROUTES.SIGN_IN}>
              <Button variant="ghost" className="text-slate-400 hover:text-white font-bold text-sm px-2">Login</Button>
            </Link>
            <Link to={AUTH_ROUTES.SIGN_UP}>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs">
                Get Started
              </Button>
            </Link>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-slate-950 border-white/5 pt-20">
                 <div className="flex flex-col gap-6 text-center">
                    <a href="#features" className="text-xl font-bold text-slate-400 hover:text-white transition-colors">Features</a>
                    <a href="#analytics" className="text-xl font-bold text-slate-400 hover:text-white transition-colors">Analytics</a>
                    <a href="#security" className="text-xl font-bold text-slate-400 hover:text-white transition-colors">Security</a>
                 </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
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
      <section className="relative pt-48 pb-20 px-6">
        <motion.div 
          style={{ scale, opacity }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              Experience the 3D Financial Future
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter family-outfit leading-[0.85] mb-10">
              Wealth <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Reimagined.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 family-outfit font-medium leading-relaxed">
              The only platform that combines immersive 3D analytics with AI-driven insights to maximize your capital.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to={AUTH_ROUTES.SIGN_UP}>
                <Button className="h-16 md:h-20 px-8 md:px-12 text-lg md:text-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[24px] shadow-[0_20px_50px_rgba(79,70,229,0.4)] group transition-all hover:scale-105">
                  Start Your Journey
                  <ArrowRight className="ml-3 size-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={AUTH_ROUTES.SIGN_IN}>
                <Button variant="outline" className="h-16 md:h-20 px-8 md:px-12 text-lg md:text-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black rounded-[24px] hover:scale-105 transition-all">
                  Live Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Elements / Stats */}
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-10">
             {[
               { label: "Active Users", value: "50K+" },
               { label: "Assets Tracked", value: "$2.4B" },
               { label: "AI Accuracy", value: "99.9%" },
               { label: "Security", value: "Bank-Grade" }
             ].map((stat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="flex flex-col gap-1"
               >
                 <span className="text-3xl md:text-4xl font-black family-outfit text-white">{stat.value}</span>
                 <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">{stat.label}</span>
               </motion.div>
             ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
            <div className="max-w-xl">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight family-outfit mb-6">Designed for the <br /> 1% of Thinkers.</h2>
              <p className="text-slate-400 text-lg font-medium">Precision tools for high-performance wealth management.</p>
            </div>
            <Link to={AUTH_ROUTES.SIGN_UP}>
               <Button variant="link" className="text-indigo-400 font-black uppercase tracking-widest p-0 flex items-center gap-2">
                 Explore all tools <ArrowRight className="size-4" />
               </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="size-8 text-indigo-400" />,
                title: "3D Analytics",
                desc: "Visualize your net worth growth with immersive 3D data mapping and predictive forecasting."
              },
              {
                icon: <Zap className="size-8 text-amber-400" />,
                title: "Neural Scan",
                desc: "Our neural networks process receipts in milliseconds, extracting every item with perfect precision."
              },
              {
                icon: <ShieldCheck className="size-8 text-emerald-400" />,
                title: "Quantum Secure",
                desc: "Future-proof encryption that protects your financial identity from next-gen cyber threats."
              },
              {
                icon: <PieChart className="size-8 text-pink-400" />,
                title: "Smart Budgets",
                desc: "Dynamic budgets that adapt to your lifestyle changes automatically using machine learning."
              },
              {
                icon: <Target className="size-8 text-cyan-400" />,
                title: "Wealth Targets",
                desc: "Set ambitious financial milestones and let our AI create the optimal path to reach them."
              },
              {
                icon: <CreditCard className="size-8 text-violet-400" />,
                title: "Cashflow Ops",
                desc: "Master your liquidity with automated bill payments and high-yield savings distribution."
              }
            ].map((feature, i) => (
              <FeatureCard 
                key={i}
                icon={feature.icon}
                title={feature.title}
                desc={feature.desc}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="py-24 px-6 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <h2 className="text-5xl font-black family-outfit mb-6">Real-time Financial <br /> Intelligence.</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
              Experience a new dimension of data. Our 3D mapping technology transforms complex spreadsheets into intuitive, actionable insights. Track every penny with surgical precision.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-black text-2xl mb-2">99%</h4>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">AI Precision</p>
              </div>
              <div>
                <h4 className="text-white font-black text-2xl mb-2">24/7</h4>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Real-time Updates</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="absolute inset-0 bg-indigo-600/20 blur-[80px] rounded-full" />
             <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015" 
                alt="Analytics Illustration" 
                className="rounded-[40px] border border-white/10 relative z-10 shadow-2xl"
              />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 px-6 bg-slate-950 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="size-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
             <ShieldCheck className="size-10 text-emerald-400" />
          </div>
          <h2 className="text-5xl font-black family-outfit mb-6">Your Privacy is <br /> our Core Protocol.</h2>
          <p className="text-slate-400 text-lg mb-12 font-medium max-w-2xl mx-auto">
            We use end-to-end encryption and zero-knowledge architecture. Not even we can see your financial data. Your trust is our most valuable asset.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
             <div className="flex items-center gap-3">
                <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">256-bit AES Encryption</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">SOC 2 Type II Compliant</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Biometric Authentication</span>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/10 -z-10" />
        <div className="max-w-4xl mx-auto text-center bg-white/5 border border-white/10 rounded-[32px] md:rounded-[60px] p-10 md:p-20 backdrop-blur-3xl relative overflow-hidden">
           <div className="absolute -top-20 -right-20 size-60 bg-indigo-500/20 blur-[100px] rounded-full" />
           <h2 className="text-5xl md:text-7xl font-black family-outfit tracking-tighter mb-8 leading-tight">Ready to elevate your <br /> financial status?</h2>
           <Link to={AUTH_ROUTES.SIGN_UP}>
             <Button className="h-16 md:h-20 px-10 md:px-16 text-lg md:text-2xl bg-white text-slate-950 hover:bg-slate-200 font-black rounded-2xl md:rounded-3xl transition-transform hover:scale-105 active:scale-95">
               Get Started Now
             </Button>
           </Link>
        </div>
      </section>

      {/* Big Footer */}
      <footer className="py-24 px-6 border-t border-white/5 bg-slate-950 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-indigo-600/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-black italic">D</span>
                </div>
                <span className="text-xl font-black tracking-tight family-outfit text-white">DHR Finance</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[240px]">
                Empowering the next generation of investors with AI-driven insights and immersive 3D analytics.
              </p>
              <div className="flex items-center gap-4">
                {["Twitter", "LinkedIn", "GitHub", "Discord"].map((social) => (
                  <div key={social} className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-indigo-600/20 hover:border-indigo-600/40 transition-all">
                    <span className="sr-only">{social}</span>
                    <div className="size-4 bg-slate-400 group-hover:bg-indigo-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-white font-black family-outfit uppercase tracking-widest text-xs mb-8">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Analytics Dashboard</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">AI Receipt Scanner</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Budget Planner</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Goal Tracking</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">API for Developers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black family-outfit uppercase tracking-widest text-xs mb-8">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Financial Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Security Whitepaper</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Community Forum</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h4 className="text-white font-black family-outfit uppercase tracking-widest text-xs mb-8">Stay Updated</h4>
              <p className="text-slate-500 text-sm mb-6">Get the latest market insights and feature updates.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:border-indigo-500/50"
                />
                <Button className="bg-indigo-600 hover:bg-indigo-700 size-10 p-0 rounded-xl">
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8 text-xs text-slate-600 font-bold uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
            <p className="text-slate-600 text-xs font-medium">© 2026 DHR Finance Global Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
