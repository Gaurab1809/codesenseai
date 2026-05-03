ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_snippets_tags ON public.snippets USING GIN(tags);
ALTER TABLE public.quiz_results ADD COLUMN IF NOT EXISTS difficulty text NOT NULL DEFAULT 'medium';