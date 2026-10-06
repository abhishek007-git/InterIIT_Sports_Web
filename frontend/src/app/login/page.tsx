'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [role, setRole] = useState('head_organizer');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const endpoint = mode === 'login' ? 'login' : 'register';
    const body = mode === 'login' ? { email, password } : { email, password, name, role };
    try {
      const res = await fetch(`http://localhost:3001/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || 'Something went wrong');
      }
      const data = await res.json();
      saveSession(data.accessToken, data.role, data.name);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h1>{mode === 'login' ? 'Log In' : 'Create Staff Account'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mode === 'register' && <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {mode === 'register' && (
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="super_admin">Super Admin</option>
            <option value="head_organizer">Head Organizer</option>
            <option value="venue_staff">Venue Staff</option>
            <option value="registration_admin">Registration Admin</option>
          </select>
        )}
        <button type="submit">{mode === 'login' ? 'Log In' : 'Create Account'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        style={{ marginTop: '1rem', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
      >
        {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Log in'}
      </button>
    </main>
  );
}