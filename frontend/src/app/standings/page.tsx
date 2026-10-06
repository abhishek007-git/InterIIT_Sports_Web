type SportStanding = { institutionId: string; name: string; points: number };
type Sport = { id: string; name: string };

async function getSports(): Promise<Sport[]> {
  try {
    const res = await fetch('http://localhost:3001/sports', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

async function getOverallStandings(): Promise<SportStanding[]> {
  try {
    const res = await fetch('http://localhost:3001/standings/overall', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

async function getSportStandings(sportId: string): Promise<SportStanding[]> {
  try {
    const res = await fetch(`http://localhost:3001/standings/sport/${sportId}`, { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

function StandingsTable({ standings }: { standings: SportStanding[] }) {
  if (standings.length === 0) {
    return <p>No standings recorded yet.</p>;
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
          <th>Rank</th><th>Institution</th><th>Points</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s, i) => (
          <tr key={s.institutionId} style={{ borderBottom: '1px solid #ddd' }}>
            <td>{i + 1}</td><td>{s.name}</td><td>{s.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function StandingsPage() {
  const sports = await getSports();
  const overall = await getOverallStandings();
  const perSport = await Promise.all(sports.map((sport) => getSportStandings(sport.id)));

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Standings</h1>
      <h2>Overall</h2>
      <StandingsTable standings={overall} />
      {sports.map((sport, i) => (
  <div key={sport.id}>
    <h2>
      {sport.name}{' '}
            <a href={`http://localhost:3001/reports/sport/${sport.id}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', marginLeft: '1rem' }}>
        Download Report (PDF)
            </a>
        </h2>
         <StandingsTable standings={perSport[i]} />
        </div>
     ))}
    </main>
  );
}