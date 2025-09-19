import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect authenticated users to chat
  redirect('/chat');
}
