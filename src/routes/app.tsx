import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, Plus, Trash2, Pencil, LogOut, Languages, Play, FileCode, Save, Copy, Download, Sparkles, Bug, Wand2, ShieldCheck, Bookmark, GraduationCap, BarChart3, Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Editor from "@monaco-editor/react";
import { useRef } from "react";

type Analysis = {
  id: string;
  name: string;
  language: string;
  code: string;
  ai_response: string | null;
  output_lang: string;
  created_at: string;
  updated_at: string;
};

const LANGS = [
  "javascript", "typescript", "python", "java", "c", "cpp", "go", "rust", "ruby", "php", "html", "css", "sql",
];

const STARTER = `// Paste your code here, then press Analyze.
function fizzbuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) console.log("fizzbuzz");
    else if (i % 3 === 0) console.log("fizz");
    else if (i % 5 === 0) console.log("buzz");
    else console.log(i);
  }
}
fizzbuzz(20);`;

const STARTERS: Record<string, string> = {
  javascript: STARTER,
  typescript: `function greet(name: string): string {\n  return "Hello, " + name;\n}\nconsole.log(greet("world"));`,
  python: `def fizzbuzz(n):\n    for i in range(1, n + 1):\n        if i % 15 == 0: print("fizzbuzz")\n        elif i % 3 == 0: print("fizz")\n        elif i % 5 == 0: print("buzz")\n        else: print(i)\n\nfizzbuzz(20)`,
  java: `public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 20; i++) System.out.println(i);\n  }\n}`,
  c: `#include <stdio.h>\nint main(){ for(int i=1;i<=20;i++) printf("%d\\n", i); return 0; }`,
  cpp: `#include <iostream>\nint main(){ for(int i=1;i<=20;i++) std::cout<<i<<"\\n"; }`,
  go: `package main\nimport "fmt"\nfunc main(){ for i:=1;i<=20;i++ { fmt.Println(i) } }`,
  rust: `fn main(){ for i in 1..=20 { println!("{}", i); } }`,
  ruby: `(1..20).each { |i| puts i }`,
  php: `<?php for ($i=1;$i<=20;$i++) echo $i."\\n";`,
  html: `<!doctype html>\n<html><body><h1>Hello</h1></body></html>`,
  css: `.btn { background: tomato; padding: 8px 14px; border-radius: 8px; }`,
  sql: `SELECT name, COUNT(*) AS total\nFROM orders\nGROUP BY name\nORDER BY total DESC;`,
};

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Workspace · CodeSense AI" }] }),
  component: AppPage,
});

function AppPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<Analysis[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [name, setName] = useState("Untitled analysis");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTER);
  const [outputLang, setOutputLang] = useState<"en" | "bn">("en");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"explain" | "bugs" | "optimize" | "security" | "bangla">("explain");
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate2 = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else {
        setReady(true);
        loadList();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function loadList() {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems(data ?? []);
  }

  function loadItem(item: Analysis) {
    setActiveId(item.id);
    setName(item.name);
    setLanguage(item.language);
    setCode(item.code);
    setOutputLang((item.output_lang as "en" | "bn") || "en");
    setAiResponse(item.ai_response ?? "");
  }

  function newAnalysis() {
    setActiveId(null);
    setName("Untitled analysis");
    setLanguage("javascript");
    setCode(STARTER);
    setAiResponse("");
  }

  function loadStarter(lang: string) {
    setLanguage(lang);
    if (!activeId && (code.trim() === "" || Object.values(STARTERS).includes(code) || code === STARTER)) {
      setCode(STARTERS[lang] ?? "");
    }
  }

  async function saveCurrent(nextResponse?: string) {
    setSaving(true);
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user.id;
    if (!uid) return;
    const payload = {
      user_id: uid,
      name,
      language,
      code,
      output_lang: outputLang,
      ai_response: nextResponse ?? aiResponse ?? null,
    };
    if (activeId) {
      const { error } = await supabase.from("analyses").update(payload).eq("id", activeId);
      if (error) toast.error(error.message);
    } else {
      const { data, error } = await supabase.from("analyses").insert(payload).select().single();
      if (error) toast.error(error.message);
      else if (data) setActiveId(data.id);
    }
    await loadList();
    setSaving(false);
  }

  async function analyze() {
    if (!code.trim()) {
      toast.error("Paste some code first.");
      return;
    }
    setAnalyzing(true);
    setAiResponse("");
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language, outputLang, mode }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Analysis failed");
        return;
      }
      setAiResponse(json.content);
      await saveCurrent(json.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Network error");
    } finally {
      setAnalyzing(false);
    }
  }

  async function rename(id: string, currentName: string) {
    const next = window.prompt("Rename analysis", currentName);
    if (!next || next === currentName) return;
    const { error } = await supabase.from("analyses").update({ name: next }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      if (id === activeId) setName(next);
      loadList();
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this analysis?")) return;
    const { error } = await supabase.from("analyses").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      if (id === activeId) newAnalysis();
      loadList();
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  function onEditorKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      analyze();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const t = e.currentTarget;
      const s = t.selectionStart, en = t.selectionEnd;
      const next = code.slice(0, s) + "  " + code.slice(en);
      setCode(next);
      requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 2; });
    }
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const map: Record<string, string> = { py: "python", js: "javascript", ts: "typescript", java: "java", cpp: "cpp", c: "c", go: "go", rs: "rust", rb: "ruby", php: "php", html: "html", css: "css", sql: "sql" };
    const detected = map[ext] ?? language;
    const reader = new FileReader();
    reader.onload = () => {
      setCode(String(reader.result ?? ""));
      setLanguage(detected);
      if (!name || name === "Untitled analysis") setName(file.name);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  async function saveAsSnippet() {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user.id;
    if (!uid) return;
    const { error } = await supabase.from("snippets").insert({ user_id: uid, name, language, code });
    if (error) toast.error(error.message);
    else toast.success("Saved to snippets");
  }

  async function startQuiz() {
    if (!code.trim()) { toast.error("Add some code first."); return; }
    sessionStorage.setItem("quiz.payload", JSON.stringify({ code, language, outputLang, name, analysisId: activeId }));
    navigate2({ to: "/quiz" });
  }

  function copyResponse() {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    toast.success("Copied to clipboard");
  }

  function downloadResponse() {
    if (!aiResponse) return;
    const blob = new Blob([`# ${name}\n\n${aiResponse}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click(); URL.revokeObjectURL(url);
  }

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b-2 border-foreground bg-card">
        <div className="px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/"><Logo /></Link>
            <span className="hidden md:inline text-xs font-mono px-2 py-0.5 rounded bg-foreground text-background">/workspace</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/snippets" className="hidden md:inline-flex h-9 px-3 rounded-xl border-2 border-foreground bg-card hover:bg-subtle text-[13px] font-semibold items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5" /> Snippets
            </Link>
            <Link to="/progress" className="hidden md:inline-flex h-9 px-3 rounded-xl border-2 border-foreground bg-card hover:bg-subtle text-[13px] font-semibold items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Progress
            </Link>
            <div className="flex items-center gap-1 p-1 rounded-xl border-2 border-foreground bg-background">
              <Languages className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
              {(["en", "bn"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setOutputLang(l)}
                  className={`px-2.5 py-1 rounded-lg text-[12px] font-bold transition-colors ${
                    outputLang === l ? "bg-foreground text-background" : "hover:bg-subtle"
                  }`}
                >
                  {l === "en" ? "English" : "বাংলা"}
                </button>
              ))}
            </div>
            <button
              onClick={signOut}
              className="h-9 px-3 rounded-xl border-2 border-foreground bg-card hover:bg-subtle transition-colors text-[13px] font-semibold inline-flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] min-h-[calc(100vh-3.5rem)]">
        {/* History panel */}
        <aside className="border-r-2 border-foreground bg-subtle/40 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <button
            onClick={newAnalysis}
            className="w-full h-10 rounded-xl border-2 border-foreground bg-[var(--lime)] font-bold text-[13px] shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> New analysis
          </button>
          <div className="text-[11px] uppercase tracking-widest font-mono text-muted-foreground px-1 pt-2">History</div>
          {items.length === 0 && (
            <div className="text-xs text-muted-foreground px-1">No analyses yet. Run your first one →</div>
          )}
          <ul className="space-y-1.5">
            {items.map((it) => {
              const active = it.id === activeId;
              return (
                <li key={it.id}>
                  <div
                    className={`group rounded-xl border-2 border-foreground p-2.5 cursor-pointer transition-all ${
                      active ? "bg-card shadow-pop -translate-y-0.5" : "bg-card/60 hover:bg-card hover:-translate-y-0.5 hover:shadow-pop"
                    }`}
                    onClick={() => loadItem(it)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold truncate">{it.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1.5">
                          <FileCode className="h-3 w-3" /> {it.language}
                          <span>·</span>
                          {new Date(it.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); rename(it.id, it.name); }}
                          className="h-6 w-6 grid place-items-center rounded border border-foreground bg-background hover:bg-subtle"
                          aria-label="Rename"
                        ><Pencil className="h-3 w-3" /></button>
                        <button
                          onClick={(e) => { e.stopPropagation(); remove(it.id); }}
                          className="h-6 w-6 grid place-items-center rounded border border-foreground bg-background hover:bg-[var(--coral)]"
                          aria-label="Delete"
                        ><Trash2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main */}
        <main className="p-4 lg:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 min-w-[200px] h-10 px-3 rounded-xl border-2 border-foreground bg-card font-semibold outline-none focus:shadow-pop transition-shadow"
            />
            <select
              value={language}
              onChange={(e) => loadStarter(e.target.value)}
              className="h-10 px-3 rounded-xl border-2 border-foreground bg-card font-mono text-[13px] outline-none"
            >
              {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <button onClick={() => fileRef.current?.click()} className="h-10 px-3 rounded-xl border-2 border-foreground bg-card hover:bg-subtle text-[13px] font-semibold inline-flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Upload
            </button>
            <input ref={fileRef} type="file" hidden accept=".py,.js,.ts,.java,.c,.cpp,.go,.rs,.rb,.php,.html,.css,.sql,.txt" onChange={onUpload} />
            <button onClick={saveAsSnippet} className="h-10 px-3 rounded-xl border-2 border-foreground bg-card hover:bg-subtle text-[13px] font-semibold inline-flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5" /> Snippet
            </button>
            <button
              onClick={() => saveCurrent()}
              disabled={saving}
              className="h-10 px-3.5 rounded-xl border-2 border-foreground bg-card hover:bg-subtle font-semibold text-[13px] inline-flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={startQuiz} className="h-10 px-3.5 rounded-xl border-2 border-foreground bg-[var(--violet)] font-bold text-[13px] shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all inline-flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" /> Quiz me
            </button>
            <button
              onClick={analyze}
              disabled={analyzing}
              className="h-10 px-4 rounded-xl border-2 border-foreground bg-[var(--coral)] font-bold text-[13px] shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {analyzing ? "Analyzing…" : "Analyze"}
            </button>
          </div>

          {/* Mode tabs */}
          <div className="flex flex-wrap gap-1.5">
            {([
              { id: "explain", label: "Explain", icon: Sparkles, color: "var(--lime)" },
              { id: "bugs", label: "Bugs", icon: Bug, color: "var(--coral)" },
              { id: "optimize", label: "Optimize", icon: Wand2, color: "var(--sky)" },
              { id: "security", label: "Security", icon: ShieldCheck, color: "var(--amber)" },
              { id: "bangla", label: "বাংলা", icon: Languages, color: "var(--violet)" },
            ] as const).map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border-2 border-foreground text-[12.5px] font-bold transition-all ${mode === m.id ? "shadow-pop -translate-y-0.5" : "bg-card/60 hover:-translate-y-0.5 hover:shadow-pop"}`}
                style={mode === m.id ? { background: m.color } : undefined}
              >
                <m.icon className="h-3.5 w-3.5" /> {m.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Editor */}
            <div className="rounded-2xl border-[2.5px] border-foreground bg-card shadow-pop overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b-2 border-foreground bg-subtle">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--coral)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--amber,#f5b700)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--lime)]" />
                </div>
                <div className="font-mono text-[11px] font-bold opacity-80">{language} · {lineCount} lines</div>
                <span className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-foreground text-background">editor</span>
              </div>
              <Editor
                height="480px"
                language={monacoLang(language)}
                value={code}
                theme="vs-dark"
                onChange={(v) => setCode(v ?? "")}
                onMount={(editor, monaco) => {
                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => analyze());
                }}
                options={{
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  fontSize: 13,
                  minimap: { enabled: false },
                  smoothScrolling: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 14 },
                  cursorBlinking: "smooth",
                  renderLineHighlight: "all",
                }}
              />
            </div>

            {/* AI response */}
            <div className="rounded-2xl border-[2.5px] border-foreground bg-card shadow-pop overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b-2 border-foreground bg-subtle">
                <span className="font-display font-bold text-[13px] inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> CodeSense Mentor
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={copyResponse}
                    disabled={!aiResponse}
                    className="h-7 w-7 grid place-items-center rounded-md border border-foreground bg-background hover:bg-subtle disabled:opacity-40"
                    aria-label="Copy"
                    title="Copy response"
                  ><Copy className="h-3.5 w-3.5" /></button>
                  <button
                    onClick={downloadResponse}
                    disabled={!aiResponse}
                    className="h-7 w-7 grid place-items-center rounded-md border border-foreground bg-background hover:bg-subtle disabled:opacity-40"
                    aria-label="Download"
                    title="Download as Markdown"
                  ><Download className="h-3.5 w-3.5" /></button>
                  <span className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[var(--violet)] text-foreground border border-foreground">
                    {outputLang === "bn" ? "বাংলা" : "english"}
                  </span>
                </div>
              </div>
              <div className="p-5 h-[480px] overflow-y-auto">
                {analyzing && !aiResponse && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" /> Reading your code…
                  </div>
                )}
                {!analyzing && !aiResponse && (
                  <div className="text-sm text-muted-foreground">
                    Press <span className="font-mono px-1.5 py-0.5 bg-subtle rounded border border-foreground">Analyze</span> (or <span className="font-mono px-1.5 py-0.5 bg-subtle rounded border border-foreground">⌘/Ctrl + Enter</span>) to get an explanation, bug report, and concept guide tailored for beginners.
                  </div>
                )}
                {aiResponse && (
                  <article className="text-[13.5px] leading-7 font-sans space-y-3 markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: ({ children }) => <h2 className="font-display text-base font-bold mt-4 mb-1 border-b-2 border-foreground/15 pb-1">{children}</h2>,
                        h3: ({ children }) => <h3 className="font-display text-sm font-bold mt-3 mb-1">{children}</h3>,
                        p: ({ children }) => <p className="mb-2">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
                        code: ({ children, className }) => {
                          const isBlock = (className ?? "").includes("language-");
                          return isBlock
                            ? <code className="block whitespace-pre overflow-x-auto p-3 rounded-lg bg-subtle border border-foreground/20 font-mono text-[12.5px]">{children}</code>
                            : <code className="px-1 py-0.5 rounded bg-subtle border border-foreground/20 font-mono text-[12px]">{children}</code>;
                        },
                        pre: ({ children }) => <pre className="my-2">{children}</pre>,
                        a: ({ children, href }) => <a className="underline decoration-2 underline-offset-2" href={href} target="_blank" rel="noreferrer">{children}</a>,
                      }}
                    >
                      {aiResponse}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}