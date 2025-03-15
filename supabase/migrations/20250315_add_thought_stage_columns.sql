-- Add thought stage columns to the tasks table
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS definition TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS scenario TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS context TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS function TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS implementation TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS test_case TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS validation TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS deployment TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS result TEXT;
