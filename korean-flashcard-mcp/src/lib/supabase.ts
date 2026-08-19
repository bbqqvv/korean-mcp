import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zntidmzvnndpxklopakm.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudGlkbXp2bm5kcHhrbG9wYWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjA4ODIsImV4cCI6MjA3NDYzNjg4Mn0.P08Vq_giL-98Xhn0jAAFba7vbiUu8HpY8E5htJqudno';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
