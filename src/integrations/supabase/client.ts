
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://icfpebxjduqodhzvzvzv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZnBlYnhqZHVxb2RoenZ6dnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDA1MDksImV4cCI6MjA1NzM3NjUwOX0.LRs4oTlUxsOqq_WXUdEnQXFBN1aON92vs_DFQBs8cBc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
