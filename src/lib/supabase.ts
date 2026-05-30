import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? "https://adm.negociotopografico.com.br";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3NjYxODU0MCwiZXhwIjo0OTMyMjkyMTQwLCJyb2xlIjoiYW5vbiJ9.IvOY9oT8txAdekYA8j3m0dP8tQwKQtmRWJ_wRTsSG1o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
