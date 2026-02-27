import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "../Login.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
  loginHook: ReturnType<typeof useLogin>;
}

export const LoginForm = ({ loginHook }: LoginFormProps) => {
  const { t } = useTranslation(["login", "common"]);
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    isLoading,
    handleLogin,
    navigate,
  } = loginHook;

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-username"
          className="text-[13px] font-semibold text-foreground tracking-tight"
        >
          {t("common:username")}
        </label>
        <Input
          id="login-username"
          type="text"
          placeholder={t("common:username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full h-[46px] px-4 border-[1.5px] border-border rounded-xl bg-muted/40 text-sm font-Inter font-sans-serif text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}
          autoComplete="username"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <Label
            htmlFor="login-password"
            className="text-[13px] font-semibold text-foreground tracking-tight"
          >
            {t("common:password")}
          </Label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-xs font-medium text-primary hover:opacity-70 transition-opacity"
          >
            {t("forgotPassword")}
          </button>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[46px] px-4 pr-12 border-[1.5px] border-border rounded-xl bg-muted/40 text-sm font-Inter font-sans-seriftext-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
            autoComplete="current-password"
          />
          <Button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-[38px] h-[38px] flex items-center justify-center rounded-lg  hover:text-white hover:bg-primary/[0.6] "
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="group relative flex items-center justify-center gap-2 w-full h-12 mt-1 rounded-xl bg-gradient-to-br from-primary to-[#5A6EB3] text-white text-[15px] font-semibold tracking-tight overflow-hidden transition-all duration-200 hover:shadow-[0_8px_24px_rgba(72,93,170,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/[0.12] opacity-0 group-hover:opacity-100 transition-opacity" />
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin relative z-10" />
            <span className="relative z-10">{t("signingIn")}</span>
          </>
        ) : (
          <span className="relative z-10">{t("common:signIn")}</span>
        )}
      </Button>
    </form>
  );
};
