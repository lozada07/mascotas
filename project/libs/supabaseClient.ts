// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojbquufbszpagbmbyakc.supabase.co'; // Sustituye por tu URL
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qYnF1dWZic3pwYWdibWJ5YWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0OTAxNjcsImV4cCI6MjA1NzA2NjE2N30.8HdAiNUsXZ4Y5QMbs4yUVFF6RqwL4GZrn0QgcitURnk'; // Sustituye por tu clave pública

export const supabase = createClient(supabaseUrl, supabaseKey);
