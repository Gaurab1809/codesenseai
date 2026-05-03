
CREATE TABLE public.snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Untitled snippet',
  language text NOT NULL DEFAULT 'javascript',
  code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select snippets" ON public.snippets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own insert snippets" ON public.snippets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update snippets" ON public.snippets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own delete snippets" ON public.snippets FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER snippets_updated_at BEFORE UPDATE ON public.snippets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  analysis_id uuid REFERENCES public.analyses(id) ON DELETE SET NULL,
  topic text NOT NULL DEFAULT 'general',
  language text NOT NULL DEFAULT 'javascript',
  score int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select quiz" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own insert quiz" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own delete quiz" ON public.quiz_results FOR DELETE USING (auth.uid() = user_id);
