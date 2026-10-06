import RecordStandingsForm from './record-standings-form';

type Fixture = { id: string; stage: string; status: string; discipline: { name: string; sport: { name: string } } };

async function getFixtures(): Promise<Fixture[]> {
  try {
    const res = await fetch('http://localhost:3001/fixtures', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

export default async function RecordStandingsPage() {
  const fixtures = await getFixtures();
  const confirmedFixtures = fixtures.filter((f) => f.status === 'confirmed');

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Record Standings</h1>
      <p>Pick a confirmed fixture, then assign rank and points to whoever competed.</p>
      <RecordStandingsForm fixtures={confirmedFixtures} />
    </main>
  );
}