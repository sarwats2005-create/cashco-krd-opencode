import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://7k4pu358.ap-southeast.insforge.app',
  anonKey: process.env.NEXT_PUBLIC_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTkzNzF9.hcTaGixnECtqoVNUYc8jGlRDQFmpgiPLw5mjDOOT2As',
});

export default insforge;
