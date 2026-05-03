import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, Lock } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password · CodeSense AI" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery hash automatically; confirm we have a session.
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        toast.error("Reset link is invalid or expired. Request a new one.");
        navigate({ to: "/auth" });
      } else setReady(true);
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (password !== confirm) return toast.error("Passwords don't match.");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You're signed in.");
      navigate({ to: "/app" });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 dot-paper">
      <Toaster />
      <div className="w-full max-w-md rounded-2xl border-[2.5px] border-foreground bg-card p-7 shadow-pop-lg">
        <Link to="/" className="inline-block mb-5"><Logo /></Link>
        <h1 className="text-2xl font-display font-bold tracking-tight">Set a new password</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose a strong password you haven't used before.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <Field id="pw" label="New password" value={password} onChange={setPassword} />
          <Field id="pw2" label="Confirm password" value={confirm} onChange={setConfirm} />
          <button
            disabled={loading}
            className="w-full h-11 rounded-xl border-2 border-foreground bg-[var(--lime)] text-[oklch(0.18_0.02_270)] font-bold shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)]"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Updating…" : "Update password →"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="text-[12px] font-semibold uppercase tracking-wider">{label}</label>
      <div className="mt-1 relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <input
          id={id}
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-9 pr-3 rounded-xl border-2 border-foreground bg-background outline-none focus-visible:shadow-pop focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-shadow"
          placeholder="••••••••"
        />
      </div>
    </div>
  );
}
