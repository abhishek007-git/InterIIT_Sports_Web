'use client';

import { useState } from 'react';

type Standing = { id: string; rank: number; fixtureId: string; fixture: { stage: string; discipline: { name: string; sport: { name: string } } } };
type Participant = { id: string; name: string; registrationNo: string; fixtureStandings: Standing[] };

export default function CertificatePage() {
  const [registrationNo, setRegistrationNo] = useState('');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setNotFound(false);
    setParticipant(null);
    try {
      const res = await fetch(`http://localhost:3001/participants/lookup/${registrationNo}`);
      const data = await res.json();
      if (!data) {
        setNotFound(true);
        return;
      }
      setParticipant(data);
    } catch {
      setNotFound(true);
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>My Certificate</h1>
      <p>Enter your registration number to find your results and download certificates.</p>

      <form onSubmit={handleLookup} style={{ display: 'flex', gap: '0.5rem' }}>
        <input placeholder="Your registration number" value={registrationNo} onChange={(e) => setRegistrationNo(e.target.value)} />
        <button type="submit">Find my results</button>
      </form>

      {notFound && <p style={{ color: 'red' }}>No participant found with that registration number.</p>}

      {participant && (
        <div style={{ marginTop: '1rem' }}>
          <p>Welcome, {participant.name}!</p>
          {participant.fixtureStandings.length === 0 ? (
            <p>No results recorded for you yet.</p>
          ) : (
            <ul>
              {participant.fixtureStandings.map((s) => (
                <li key={s.id} style={{ marginBottom: '0.5rem' }}>
                  {s.fixture.discipline.sport.name} — {s.fixture.discipline.name} ({s.fixture.stage}): Rank {s.rank}
                  {' — '}
                  <a href={`http://localhost:3001/certificates/${participant.id}/${s.fixtureId}`} target="_blank" rel="noreferrer">
                    Download Certificate
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}