type Fixture = {
  id: string;
  scheduledAt: string;
  stage: string;
  status: string;
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

function groupByDay(fixtures: Fixture[]): Record<string, Fixture[]> {
  const groups: Record<string, Fixture[]> = {};
  for (const fixture of fixtures) {
    const day = new Date(fixture.scheduledAt).toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    if (!groups[day]) groups[day] = [];
    groups[day].push(fixture);
  }
  return groups;
}

export default async function SchedulePage() {
  const fixtures = await getFixtures();
  const grouped = groupByDay(fixtures);
  const days = Object.keys(grouped);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 700 }}>
      <h1>Schedule</h1>
      {days.length === 0 && <p>No fixtures scheduled yet.</p>}
      {days.map((day) => (
        <section key={day} style={{ marginBottom: '2rem' }}>
          <h2>{day}</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
                <th>Time</th>
                <th>Sport</th>
                <th>Event</th>
                <th>Stage</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {grouped[day].map((f) => (
                <tr key={f.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td>{new Date(f.scheduledAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{f.discipline.sport.name}</td>
                  <td>{f.discipline.name}</td>
                  <td>{f.stage}</td>
                  <td>{f.venue.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}