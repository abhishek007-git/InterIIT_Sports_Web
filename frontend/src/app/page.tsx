async function getSports() {
  try {
    const res = await fetch('http://localhost:3001/sports', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const sports = await getSports();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Sports Meet Platform</h1>
      <p>Frontend is running ✅</p>

      <h2>Sports</h2>
      {sports.length === 0 ? (
        <p>No sports yet — add one with curl, then refresh.</p>
      ) : (
        <ul>
          {sports.map((sport: { id: string; name: string; formatType: string }) => (
            <li key={sport.id}>
              {sport.name} <em>({sport.formatType})</em>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}