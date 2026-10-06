'use client';
import { getAuthHeaders } from '@/lib/auth';
import { useState } from 'react';

type RawEntry = { id: string; enteredBy: string; value: string; notes: string | null; createdAt: string };

type PendingFixture = {
  id: string;
  scheduledAt: string;
  stage: string;
  discipline: { name: string; sport: { name: string } };
  venue: { name: string };
  rawEntries: RawEntry[];
};

function ConfirmRow({ fixture }: { fixture: PendingFixture }) {
  const latestEntry = fixture.rawEntries[0];
  const [confirmedBy, setConfirmedBy] = useState('');
  const [value, setValue] = useState(latestEntry?.value ?? '');
  const [notes, setNotes] = useState(latestEntry?.notes ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleConfirm() {
    setStatus('saving');
    setErrorMessage('');
    try {
      const res = await fetch('http://localhost:3001/confirmed-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ fixtureId: fixture.id, confirmedBy, value, notes: notes || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Something went wrong');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (status === 'success') {
    return (
      <li style={{ border: '1px solid #9c9', padding: '1rem', borderRadius: 8, marginBottom: '1rem', background: '#f2fff2' }}>
        <strong>{fixture.discipline.sport.name} — {fixture.discipline.name} ({fixture.stage})</strong>
        <p style={{ color: 'green' }}>Confirmed and published.</p>
      </li>
    );
  }

  return (
    <li style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
      <strong>{fixture.discipline.sport.name} — {fixture.discipline.name} ({fixture.stage})</strong>
      <p style={{ margin: '0.25rem 0', color: '#666' }}>{fixture.venue.name}</p>

      <p style={{ fontSize: '0.9rem' }}>Raw entries submitted:</p>
      <ul style={{ fontSize: '0.9rem' }}>
        {fixture.rawEntries.map((entry) => (
          <li key={entry.id}>{entry.value} {entry.notes && `(${entry.notes})`} — by {entry.enteredBy}</li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input placeholder="Your name (Head Organizer)" value={confirmedBy} onChange={(e) => setConfirmedBy(e.target.value)} />
        <input placeholder="Final value" value={value} onChange={(e) => setValue(e.target.value)} />
        <input placeholder="Notes (optional)" value={notes ?? ''} onChange={(e) => setNotes(e.target.value)} />
        <button onClick={handleConfirm} disabled={status === 'saving' || !confirmedBy || !value}>
          {status === 'saving' ? 'Confirming...' : 'Confirm & Publish'}
        </button>
        {status === 'error' && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </li>
  );
}

export default function ConfirmList({ fixtures }: { fixtures: PendingFixture[] }) {
  if (fixtures.length === 0) {
    return <p>Nothing pending confirmation right now.</p>;
  }
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {fixtures.map((fixture) => <ConfirmRow key={fixture.id} fixture={fixture} />)}
    </ul>
  );
}