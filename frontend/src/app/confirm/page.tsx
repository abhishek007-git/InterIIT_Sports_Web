import ConfirmList from './confirm-list';

type RawEntry = { id: string; enteredBy: string; value: string; notes: string | null; createdAt: string };

type PendingFixture = {
  id: string;
  scheduledAt: string;
  stage: string;
  discipline: { name: string; sport: { name: string } };
  venue: { name: string };
  rawEntries: RawEntry[];
};

async function getPending(): Promise<PendingFixture[]> {
  try {
    const res = await fetch('http://localhost:3001/raw-entries/pending', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ConfirmPage() {
  const pending = await getPending();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 700 }}>
      <h1>Confirm Results</h1>
      <p>For Head Organizers: review what venue staff submitted, then confirm to make it official.</p>
      <ConfirmList fixtures={pending} />
    </main>
  );
}