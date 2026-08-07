import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://skytibldupkdsqpynone.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNreXRpYmxkdXBrZHNxcHlub25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTkzMzIsImV4cCI6MjEwMTU3NTMzMn0.rHaaIwwdzbVwzfXCE9-8RvysHhZLrLgc3qTqc0t5pBY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 'system_config').single();
  console.log(data?.logo_url);
}
main();
