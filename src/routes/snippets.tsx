import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Bookmark, Trash2, ArrowRight, Loader2, FileCode, Search, Tag, Plus, X } from "lucide-react";

type Snippet = { id: string; name: string; language: string; code: string; updated_at: string; tags: string[] };

export const Route = createFileRoute("/snippets")({
  head: () => ({ meta: [{ title: "Snippets · CodeSense AI" }] }),
  component: SnippetsPage,
});

function SnippetsPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<Snippet[]>([]);
  const [query, setQuery] = useState("");
  const [activeLang, setActiveLang] = useState<string>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { if (!session) navigate({ to: "/auth" }); });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate({ to: "/auth" }); return; }
      setReady(true);
      const { data: rows, error } = await supabase.from("snippets").select("*").order("updated_at", { ascending: false });
      if (error) toast.error(error.message); else setItems((rows ?? []) as Snippet[]);
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

  async function addTag(s: Snippet) {
    const raw = prompt("Add tags (comma separated)", "");
    if (!raw) return;
    const next = Array.from(new Set([...(s.tags ?? []), ...raw.split(",").map((t) => t.trim()).filter(Boolean)]));
    const { error } = await supabase.from("snippets").update({ tags: next }).eq("id", s.id);
    if (error) toast.error(error.message);
    else setItems((p) => p.map((x) => (x.id === s.id ? { ...x, tags: next } : x)));
  }

  async function removeTag(s: Snippet, tag: string) {
    const next = (s.tags ?? []).filter((t) => t !== tag);
    const { error } = await supabase.from("snippets").update({ tags: next }).eq("id", s.id);
    if (error) toast.error(error.message);
    else setItems((p) => p.map((x) => (x.id === s.id ? { ...x, tags: next } : x)));
  }

  const allLangs = useMemo(() => Array.from(new Set(items.map((s) => s.language))).sort(), [items]);
  const allTags = useMemo(() => Array.from(new Set(items.flatMap((s) => s.tags ?? []))).sort(), [items]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((s) => {
      if (activeLang !== "all" && s.language !== activeLang) return false;
      if (activeTag && !(s.tags ?? []).includes(activeTag)) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, query, activeLang, activeTag]);

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

        <div className="mt-8 rounded-2xl border-2 border-foreground bg-card p-3 shadow-pop space-y-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground ml-1" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, code, or tag…"
              className="flex-1 h-9 px-2 bg-transparent outline-none text-[13px]"
            />
            <select value={activeLang} onChange={(e) => setActiveLang(e.target.value)} className="h-9 px-2 rounded-lg border-2 border-foreground bg-background font-mono text-[12px]">
              <option value="all">all languages</option>
              {allLangs.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setActiveTag(null)} className={`text-[11px] font-bold px-2 py-1 rounded-lg border-2 border-foreground ${activeTag === null ? "bg-foreground text-background" : "bg-background"}`}>all tags</button>
              {allTags.map((t) => (
                <button key={t} onClick={() => setActiveTag(activeTag === t ? null : t)} className={`text-[11px] font-bold px-2 py-1 rounded-lg border-2 border-foreground inline-flex items-center gap-1 ${activeTag === t ? "bg-[var(--lime)]" : "bg-background hover:bg-subtle"}`}>
                  <Tag className="h-3 w-3" /> {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border-[2.5px] border-dashed border-foreground/40 p-10 text-center text-muted-foreground">
            No snippets yet. In the workspace, hit <span className="font-mono px-1.5 py-0.5 bg-subtle rounded border border-foreground">Snippet</span> to save the current code.
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border-[2.5px] border-dashed border-foreground/40 p-10 text-center text-muted-foreground">
            No snippets match your filters.
          </div>
        ) : (
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {filtered.map((s) => (
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
                <div className="mt-2 flex flex-wrap gap-1">
                  {(s.tags ?? []).map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-[10.5px] font-bold px-1.5 py-0.5 rounded border border-foreground bg-subtle">
                      <Tag className="h-2.5 w-2.5" /> {t}
                      <button onClick={() => removeTag(s, t)} aria-label="Remove tag" className="hover:text-[var(--coral)]"><X className="h-2.5 w-2.5" /></button>
                    </span>
                  ))}
                  <button onClick={() => addTag(s)} className="inline-flex items-center gap-1 text-[10.5px] font-bold px-1.5 py-0.5 rounded border border-dashed border-foreground/60 hover:bg-subtle">
                    <Plus className="h-2.5 w-2.5" /> tag
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