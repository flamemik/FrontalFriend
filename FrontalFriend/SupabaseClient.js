import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wwawnqmhgrzbvvbgygla.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YXducW1oZ3J6YnZ2Ymd5Z2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzA2MTMsImV4cCI6MjA3OTY0NjYxM30.5feB5Olq99DM7xq4P1OT5vgYxhggeBqZmTt2vmFTBhs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  //auth: {
  //  persistSession: true, // keeps user logged in across app restarts
  //  storage: AsyncStorage,
  //},
});
