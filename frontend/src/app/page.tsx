import RegistrationForm from './registration-form';

async function getSports() {
  try {
    const res = await fetch('http://localhost:3001/sports', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

async function getInstitutions() {
  try {
    const res = await fetch('http://localhost:3001/institutions', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const [sports, institutions] = await Promise.all([getSports(), getInstitutions()]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Sports Meet Platform</h1>
      <nav style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a href="/schedule">Schedule</a>
        <a href="/scoring">Submit a Reading</a>
        <a href="/confirm">Confirm Results</a>
        <a href="/standings/record">Record Standings</a>
        <a href="/standings">Standings</a>
        <a href="/certificate">My Certificate</a>
        <a href="/gallery">Gallery</a>
      </nav>
      <h2>Register a Participant</h2>
      <RegistrationForm sports={sports} institutions={institutions} />
    </main>
  );
}