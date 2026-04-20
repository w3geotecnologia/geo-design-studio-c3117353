import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://adm.negociotopogafico.com.br";
const supabaseAnonKey =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3NjYxODU0MCwiZXhwIjo0OTMyMjkyMTQwLCJyb2xlIjoiYW5vbiJ9.IvOY9oT8txAdekYA8j3m0dP8tQwKQtmRWJ_wRTsSG1o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);