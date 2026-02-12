import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const features = [
    {
      icon: Zap,
      title: "Instant Documentation",
      description: "Convert raw thoughts into structured SOAP, DAP, or BIRP notes in seconds."
    },
    {
      icon: ShieldCheck,
      title: "Clinically Secure",
      description: "Built with privacy in mind. Your client data is protected with enterprise-grade security."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Clarity",
      description: "Our AI helps refine your language, ensuring professional and objective clinical records."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">CalmNotes</span>
            </div>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-24 lg:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Hero Text */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="font-heading text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                Focus on your client, <br/>
                <span className="text-primary">not the paperwork.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                CalmNotes transforms your scattered session thoughts into polished, professional clinical documentation instantly. Reduce burnout and reclaim your time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = "/api/login"}
                  className="text-lg px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
                >
                  Start For Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 rounded-xl bg-white hover:bg-secondary/50 border-border hover:border-primary/20 transition-all"
                >
                  View Demo
                </Button>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Bank-level Encryption</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image/Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-50 animate-pulse" />
              <div className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-2xl">
                {/* Fake UI content representing a note */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border/50 pb-4">
                    <div>
                      <h3 className="font-bold text-lg">Session Note</h3>
                      <p className="text-xs text-muted-foreground">Generated just now</p>
                    </div>
                    <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">SOAP Format</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-full" />
                    <div className="h-4 bg-secondary rounded w-5/6" />
                    <div className="h-4 bg-secondary rounded w-4/5" />
                  </div>
                  <div className="pt-4 flex gap-3">
                     <div className="h-10 w-24 bg-primary rounded-lg opacity-90" />
                     <div className="h-10 w-24 bg-secondary rounded-lg" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 lg:mt-32 grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-border/50 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalmNotes. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
