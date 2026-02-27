import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./Login.hook";
import { images } from "@/assets";

import { Briefcase, Shield, Users, BarChart3, AlertCircle } from "lucide-react";

const LoginScreen = () => {
  const loginHook = useLogin();
  const { error, navigate } = loginHook;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center relative overflow-hidden p-4 md:p-6 lg:p-4 font-Inter font-sans-serif">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        <div className="absolute -top-28 -right-24 w-[500px] h-[500px] rounded-full bg-primary/[0.12] blur-[80px] animate-float" />
        <div className="absolute -bottom-24 -left-20 w-[400px] h-[400px] rounded-full bg-secondary/[0.12] blur-[80px] animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-accent/[0.12] blur-[80px] animate-float-mid" />
      </div>

      <div className="relative z-10 flex w-full max-w-[1000px] min-h-[500px] lg:min-h-[540px] xl:max-w-[1100px] xl:min-h-[620px] rounded-3xl overflow-hidden shadow-0_25px_60px_rgba(72,93,170,0.12) shadow-0_0_0_1px_rgba(255,255,255,0.3) animate-fade-up">
        <div className="hidden md:flex flex-[1] lg:flex-[1.1] bg-gradient-to-br from-[#485DAA] via-[#485DAA]/90 to-[#364986] p-7 lg:p-8 xl:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08)_0% bg-transparent_50%) bg-radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05)_0% bg-transparent_50%)" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 backdrop-blur-xlflex items-center justify-center ">
                <img
                  src={images.logo}
                  alt="Team collaboration"
                  className="w-full max-w-[360px] xl:max-w-[400px] h-auto  drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-float-img"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                HRM Sparkminds System
              </span>
            </div>

            <div className="flex justify-center items-center flex-1 py-5">
              <img
                src={images.heroIllustration}
                alt="Team collaboration"
                className="w-full max-w-[260px] lg:max-w-[300px] xl:max-w-[360px] h-auto rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-float-img"
              />
            </div>

            <div>
              <h2 className="text-[24px] lg:text-[28px] xl:text-3xl font-extrabold text-white leading-tight tracking-tight">
                Manage your team
                <br />
                <span className="bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                  effortlessly
                </span>
              </h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-[340px]">
                Streamline HR processes, track employee performance, and build a
                better workplace — all in one platform.
              </p>
            </div>

            <div className="flex gap-2 mt-6 flex-wrap">
              {[
                { icon: Users, label: "Team Management" },
                { icon: BarChart3, label: "Analytics" },
                { icon: Shield, label: "Secure" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.12] backdrop-blur-sm border border-white/[0.12 rounded-full text-white/90 text-xs font-medium hover:bg-white/20 transition-colors"
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white/85 backdrop-blur-2xl flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-[400px] flex flex-col gap-6">
            <div className="flex md:hidden items-center justify-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">
                HRM System
              </span>
            </div>

            <div className="bg-white rounded-[20px] p-6 sm:p-7 shadow-[0_8px_32px_rgba(99,69,237,0.08)] border border-black/[0.04] flex flex-col gap-4 sm:gap-4">
              <div className="text-center">
                <h1 className="text-[24px] sm:text-[26px] font-extrabold text-foreground tracking-tighter">
                  Welcome Back
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Sign in to your HR account to continue
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-destructive/5 border border-destructive/20 rounded-xl text-destructive text-[13px] font-medium animate-shake">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <LoginForm loginHook={loginHook} />

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                  or
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-[#485DAA] font-semibold hover:opacity-80 hover:underline transition-opacity"
                >
                  Create account
                </button>
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground/70">
              © {new Date().getFullYear()} HRM System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
