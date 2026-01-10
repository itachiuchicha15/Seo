import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irotejidwgselhkuandk.supabase.co';
const supabaseAnonKey = 'sb_publishable_eeg40Ijp2LaGx0H489D0hg_O9MXjWPY';

// The Supabase client is now initialized with your provided project credentials.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Since the configuration is now provided, this error check is null.
export const SUPABASE_CONFIG_ERROR: string | null = null;
