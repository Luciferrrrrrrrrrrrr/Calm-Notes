import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CheckCircle2, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();

  const isSubmitting = isLoggingIn || isRegistering;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ email, password, firstName, lastName });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

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
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
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

            {/* Auth Form */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="border-border/50 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                  </CardTitle>
                  <CardDescription>
                    {mode === "login"
                      ? "Sign in to access your clinical notes"
                      : "Start documenting sessions in seconds"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Jane"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@practice.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === "register" ? "Min. 8 characters" : "••••••••"}
                        required
                        minLength={mode === "register" ? 8 : undefined}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      {mode === "login" ? (
                        <>
                          Don't have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setMode("register")}
                            className="text-primary hover:underline font-medium"
                          >
                            Sign up
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setMode("login")}
                            className="text-primary hover:underline font-medium"
                          >
                            Sign in
                          </button>
                        </>
                      )}
                    </p>
                  </form>
                </CardContent>
              </Card>
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
