'use client';

import { useEffect, useState } from 'react';
import { getSession, clearSession } from '@/lib/auth';

export default function AuthStatus() {
  const [session, setSession] = useState<{ role: string; name: string } | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  if (!session) {
    return <a href="/login">Log In (Staff)</a>;
  }

  return (
    <span>
      Logged in as {session.name} ({session.role}){' '}
      <button onClick={() => { clearSession(); window.location.reload(); }} style={{ marginLeft: '0.5rem' }}>
        Log out
      </button>
    </span>
  );
}