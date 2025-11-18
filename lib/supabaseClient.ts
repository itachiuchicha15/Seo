import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cihibigxsvrzqjwshvwi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpaGliaWd4c3ZyenFqd3NodndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjcwMTksImV4cCI6MjA3ODk0MzAxOX0.eO4wGBCtNuFvsdU0z-BUyZ44NzuNnBwHJAi9ZWlFmRs';

// The Supabase client is now initialized with hardcoded credentials.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Since the configuration is hardcoded, this error check is no longer necessary
// and is set to null to prevent the error screen from showing.
export const SUPABASE_CONFIG_ERROR: string | null = null;
