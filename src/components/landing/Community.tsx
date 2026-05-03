import { motion } from "framer-motion";
import { Heart, MessageCircle, GitFork } from "lucide-react";

const snippets = [
  { user: "@neha_codes", lang: "Python", title: "Cleaner FizzBuzz with match", likes: 218, comments: 14, forks: 32 },
  { user: "@arif.dev", lang: "TypeScript", title: "Why my useEffect ran twice", likes: 412, comments: 38, forks: 64 },
  { user: "@mira.k", lang: "C++", title: "Iterative DFS without stack overflow", likes: 156, comments: 9, forks: 21 },
];

export function Community() {
  return (
    <section className="relative py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="max-w-2xl">
            <div className="text-[12px] font-medium text-primary">Community</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
              Learn out loud. Together.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Share reviews, fork public snippets, climb the developer leaderboards.
            </p>
          </div>
          <a href="#" className="text-[13px] text-primary hover:underline">Browse all snippets →</a>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {snippets.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{s.user}</span>
                <span className="px-1.5 py-0.5 rounded bg-subtle text-muted-foreground font-mono">{s.lang}</span>
              </div>
              <h3 className="mt-3 text-[14.5px] font-semibold leading-snug">{s.title}</h3>
              <div className="mt-4 flex items-center gap-4 text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {s.likes}</span>
                <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {s.comments}</span>
                <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" /> {s.forks}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
