import ScheduleView from './schedule-view';

type Fixture = {
  id: string;
  scheduledAt: string;
  stage: string;
  status: string;
  discipline: { name: string; sport: { name: string } };
  venue: { name: string };
  confirmedResult: { value: string } | null;
};

async function getFixtures(): Promise<Fixture[]> {
  try {
    const res = await fetch('http://localhost:3001/fixtures', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

export default async function SchedulePage() {
  const fixtures = await getFixtures();
  return <ScheduleView initialFixtures={fixtures} />;
}