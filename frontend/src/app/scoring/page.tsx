import RawEntryForm from './raw-entry-form';

type Fixture = {
  id: string;
  scheduledAt: string;
  stage: string;
  discipline: { name: string; sport: { name: string } };
  venue: { name: string };
};

async function getFixtures(): Promise<Fixture[]> {
  try {
    const res = await fetch('http://localhost:3001/fixtures', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ScoringPage() {
  const fixtures = await getFixtures();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Submit a Reading</h1>
      <p>For venue staff: enter what you observed. A Head Organizer will confirm it before it counts.</p>
      <RawEntryForm fixtures={fixtures} />
    </main>
  );
}