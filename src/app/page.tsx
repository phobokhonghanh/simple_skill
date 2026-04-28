import { redirect } from 'next/navigation';

export default function RootPage() {
  // Bù đắp cho việc Middleware bị Bypass trên Cloudflare Worker
  redirect('/en');
}
