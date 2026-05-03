import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Bookmark, Trash2, ArrowRight, Loader2, FileCode } from "lucide-react";

type Snippet = { id: string; name: string; language: string; code: string; updated_at: string };

export const Route = createFileRoute("/snippets")({
  head: () => ({ meta: [{ title: "Snippets · CodeSense AI" }] }),
  component: SnippetsPage,
});

function SnippetsPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<Snippet[]>([]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { if (!session) navigate({ to: "/auth" }); });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate({ to: "/auth" }); return; }
      setReady(true);
      const { data: rows, error } = await supabase.from("snippets").select("*").order("updated_at", { ascending: false });
      if (error) toast.error(error.message); else setItems(rows ?? []);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function remove(id: string) {
    if (!confirm("Delete this snippet?")) return;
    const { error } = await supabase.from("snippets").delete().eq("id", id);
    if (error) toast.error(error.message); else setItems((p) => p.filter((s) => s.id !== id));
  }

  function openInWorkspace(s: Snippet) {
    sessionStorage.setItem("workspace.preload", JSON.stringify({ name: s.name, language: s.language, code: s.code }));
    navigate({ to: "/app" });
  }

  if (!ready) return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="sticky top-0 z-30 border-b-2 border-foreground bg-card">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Logo /></Link>
            <span className="hidden md:inline text-xs font-mono px-2 py-0.5 rounded bg-foreground text-background">/snippets</span>
          </div>
          <Link to="/app" className="h-9 px-3 rounded-xl border-2 border-foreground bg-[var(--coral)] font-bold text-[13px] inline-flex items-center gap-1.5 shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            Workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded">/saved</span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight inline-flex items-center gap-2.5">
              <Bookmark className="h-7 w-7" /> Saved snippets
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">Reusable building blocks. Open any snippet in the workspace to analyze, edit, or quiz on it.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border-[2.5px] border-dashed border-foreground/40 p-10 text-center text-muted-foreground">
            No snippets yet. In the workspace, hit <span className="font-mono px-1.5 py-0.5 bg-subtle rounded border border-foreground">Snippet</span> to save the current code.
          </div>
        ) : (
          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {items.map((s) => (
              <li key={s.id} className="rounded-2xl border-[2.5px] border-foreground bg-card p-4 shadow-pop hover:-translate-y-0.5 transition-transform">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-display font-bold truncate">{s.name}</div>
                    <div className="text-[11px] font-mono text-muted-foreground mt-0.5 inline-flex items-center gap-1.5"><FileCode className="h-3 w-3" /> {s.language} · {new Date(s.updated_at).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => remove(s.id)} className="h-8 w-8 grid place-items-center rounded-lg border-2 border-foreground bg-background hover:bg-[var(--coral)]" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <pre className="mt-3 max-h-32 overflow-hidden text-[11.5px] leading-5 font-mono p-2 rounded-lg bg-subtle border border-foreground/15">{s.code.split("\n").slice(0, 8).join("\n")}</pre>
                <button onClick={() => openInWorkspace(s)} className="mt-3 w-full h-9 rounded-xl border-2 border-foreground bg-[var(--lime)] font-bold text-[12.5px] inline-flex items-center justify-center gap-1.5">
                  Open in workspace <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}