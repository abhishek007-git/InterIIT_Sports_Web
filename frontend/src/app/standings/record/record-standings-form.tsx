'use client';

import { useEffect, useState } from 'react';

type Fixture = { id: string; stage: string; discipline: { name: string; sport: { name: string } } };
type Candidate = { id: string; name: string; institution: { id: string; name: string } };

export default function RecordStandingsForm({ fixtures }: { fixtures: Fixture[] }) {
  const [fixtureId, setFixtureId] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [entries, setEntries] = useState<Record<string, { rank: string; points: string }>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!fixtureId) {
      setCandidates([]);
      return;
    }
    fetch(`http://localhost:3001/standings/candidates/${fixtureId}`)
      .then((res) => res.json())
      .then((data: Candidate[]) => {
        setCandidates(data);
        const initial: Record<string, { rank: string; points: string }> = {};
        data.forEach((c) => {
          initial[c.id] = { rank: '', points: '' };
        });
        setEntries(initial);
      })
      .catch(() => setCandidates([]));
  }, [fixtureId]);

  function updateEntry(participantId: string, field: 'rank' | 'points', value: string) {
    setEntries((prev) => ({ ...prev, [participantId]: { ...prev[participantId], [field]: value } }));
  }

  async function handleSubmit() {
    setStatus('saving');
    setErrorMessage('');
    try {
      const toSubmit = candidates.filter((c) => entries[c.id]?.rank);
      for (const candidate of toSubmit) {
        const entry = entries[candidate.id];
        const res = await fetch('http://localhost:3001/standings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fixtureId,
            institutionId: candidate.institution.id,
            participantId: candidate.id,
            rank: Number(entry.rank),
            points: Number(entry.points || 0),
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Something went wrong');
        }
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div>
      <label>
        Fixture:{' '}
        <select value={fixtureId} onChange={(e) => setFixtureId(e.target.value)}>
          <option value="">Select a confirmed fixture</option>
          {fixtures.map((f) => (
            <option key={f.id} value={f.id}>{f.discipline.sport.name} — {f.discipline.name} ({f.stage})</option>
          ))}
        </select>
      </label>

      {candidates.length > 0 && (
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
              <th>Participant</th><th>Institution</th><th>Rank</th><th>Points</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{c.name}</td>
                <td>{c.institution.name}</td>
                <td><input type="number" style={{ width: '4rem' }} value={entries[c.id]?.rank ?? ''} onChange={(e) => updateEntry(c.id, 'rank', e.target.value)} /></td>
                <td><input type="number" style={{ width: '4rem' }} value={entries[c.id]?.points ?? ''} onChange={(e) => updateEntry(c.id, 'points', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {candidates.length === 0 && fixtureId && <p>No one is registered for this fixture&apos;s event yet.</p>}

      {candidates.length > 0 && (
        <button onClick={handleSubmit} disabled={status === 'saving'} style={{ marginTop: '1rem' }}>
          {status === 'saving' ? 'Saving...' : 'Save Standings'}
        </button>
      )}
      {status === 'success' && <p style={{ color: 'green' }}>Standings saved.</p>}
      {status === 'error' && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}