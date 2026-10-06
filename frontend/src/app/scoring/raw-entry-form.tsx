'use client';

import { useState } from 'react';

type Fixture = {
  id: string;
  scheduledAt: string;
  stage: string;
  discipline: { name: string; sport: { name: string } };
  venue: { name: string };
};

export default function RawEntryForm({ fixtures }: { fixtures: Fixture[] }) {
  const [fixtureId, setFixtureId] = useState('');
  const [enteredBy, setEnteredBy] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');
    try {
      const res = await fetch('http://localhost:3001/raw-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixtureId, enteredBy, value, notes: notes || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Something went wrong');
      }
      setStatus('success');
      setValue('');
      setNotes('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid #ccc', padding: '1rem', borderRadius: 8 }}>
      <label>
        Fixture:{' '}
        <select value={fixtureId} onChange={(e) => setFixtureId(e.target.value)} required>
          <option value="">Select fixture</option>
          {fixtures.map((f) => (
            <option key={f.id} value={f.id}>
              {f.discipline.sport.name} — {f.discipline.name} ({f.stage}) @ {f.venue.name}
            </option>
          ))}
        </select>
      </label>
      <input placeholder="Your name" value={enteredBy} onChange={(e) => setEnteredBy(e.target.value)} required />
      <input placeholder="Reading (e.g. 11.2 seconds, or 2-1)" value={value} onChange={(e) => setValue(e.target.value)} required />
      <input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button type="submit" disabled={status === 'saving'}>
        {status === 'saving' ? 'Submitting...' : 'Submit Reading'}
      </button>
      {status === 'success' && <p style={{ color: 'green' }}>Submitted — awaiting Head Organizer confirmation.</p>}
      {status === 'error' && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
}