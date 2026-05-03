import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, Mail, Lock, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · CodeSense AI" },
      { name: "description", content: "Sign in or create an account to save your code analyses." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/app" });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent. Check your inbox.");
        setMode("signin");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
        toast.success("Account created! You're in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 dot-paper">
      <Toaster />
      <div className="w-full max-w-md rounded-2xl border-[2.5px] border-foreground bg-card p-7 shadow-pop-lg">
        <Link to="/" className="inline-block mb-5"><Logo /></Link>
        <h1 className="text-2xl font-display font-bold tracking-tight">
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "signin"
            ? "Sign in to keep your analyses safe."
            : mode === "signup"
              ? "Save and revisit every analysis you run."
              : "Enter your email and we'll send you a reset link."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <div>
            <label htmlFor="auth-email" className="text-[12px] font-semibold uppercase tracking-wider">Email</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-9 pr-3 rounded-xl border-2 border-foreground bg-background outline-none focus-visible:shadow-pop focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-shadow"
                placeholder="you@codesense.ai"
              />
            </div>
          </div>
          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="text-[12px] font-semibold uppercase tracking-wider">Password</label>
                {mode === "signin" && (
                  <button type="button" onClick={() => setMode("forgot")} className="text-[11.5px] font-semibold text-muted-foreground hover:text-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-xl border-2 border-foreground bg-background outline-none focus-visible:shadow-pop focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-shadow"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}
          <button
            disabled={loading}
            className="w-full h-11 rounded-xl border-2 border-foreground bg-[var(--lime)] text-[oklch(0.18_0.02_270)] font-bold shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)]"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Please wait…" : mode === "signin" ? "Sign in →" : mode === "signup" ? "Create account →" : "Send reset link →"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          {mode === "forgot" ? (
            <button onClick={() => setMode("signin")} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </button>
          ) : (
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
            >
              {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}