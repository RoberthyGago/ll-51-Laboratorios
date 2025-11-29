import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ==========================
// CONFIGURA TU SUPABASE
// ==========================
let SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaGxoY2hwbGtiZWhtc295YnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTc1ODEsImV4cCI6MjA3OTc3MzU4MX0.p-3HSbAFYXQeGYcOFlkTZ_OxTgF-1i7ym9Wh13QtKxQ";
let SUPABASE_URL = "https://jphlhchplkbehmsoybtd.supabase.co";

// Crear cliente una sola vez
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 