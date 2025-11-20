import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ==========================
// CONFIGURA TU SUPABASE
// ==========================
let SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscnF4enNkdWdydnBwb3V3dHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjEwOTUsImV4cCI6MjA3NjEzNzA5NX0.3LUoyDb84upOJJCUrq_iGbfnQlVrfXB9KiTKpGRvsY0";
let SUPABASE_URL = "https://alrqxzsdugrvppouwtrz.supabase.co";

// Crear cliente una sola vez
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 