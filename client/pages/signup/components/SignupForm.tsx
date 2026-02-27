import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSignup } from "../Signup.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignupFormProps {
  signupHook: ReturnType<typeof useSignup>;
}

export const SignupForm = ({ signupHook }: SignupFormProps) => {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    isLoading,
    handleSignup,
  } = signupHook;

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4">
      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-username"
          className="text-[13px] font-semibold text-foreground tracking-tight"
        >
          Username
        </label>
        <Input
          id="signup-username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full h-[46px] px-4 border-[1.5px] border-border rounded-xl bg-muted/40 text-sm font-Inter font-sans-serif text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-email"
          className="text-[13px] font-semibold text-foreground tracking-tight"
        >
          Email Address
        </label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[46px] px-4 border-[1.5px] border-border rounded-xl bg-muted/40 text-sm font-Inter font-sans-serif text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-password"
          className="text-[13px] font-semibold text-foreground tracking-tight"
        >
          Password
        </label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[46px] px-4 pr-12 border-[1.5px] border-border rounded-xl bg-muted/40 text-sm font-Inter font-sans-serif text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
            required
            minLength={6}
          />
          <Button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-[38px] h-[38px] flex items-center justify-center rounded-lg hover:text-white hover:bg-primary/[0.6]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-confirm-password"
          className="text-[13px] font-semibold text-foreground tracking-tight"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="signup-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-[46px] px-4 pr-12 border-[1.5px] border-border rounded-xl bg-muted/40 text-sm font-Inter font-sans-serif text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
            required
          />
          <Button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-[38px] h-[38px] flex items-center justify-center rounded-lg hover:text-white hover:bg-primary/[0.6]"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="group relative flex items-center justify-center gap-2 w-full h-12 mt-2 rounded-xl bg-gradient-to-br from-primary to-[#5A6EB3] text-white text-[15px] font-semibold tracking-tight overflow-hidden transition-all duration-200 hover:shadow-[0_8px_24px_rgba(72,93,170,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/[0.12] opacity-0 group-hover:opacity-100 transition-opacity" />
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin relative z-10" />
            <span className="relative z-10">Creating Account…</span>
          </>
        ) : (
          <span className="relative z-10">Create Account</span>
        )}
      </Button>
    </form>
  );
};
