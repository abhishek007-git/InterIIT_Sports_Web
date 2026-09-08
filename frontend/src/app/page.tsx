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
      <nav style={{ marginBottom: '1.5rem' }}>
        <a href="/schedule">View Schedule →</a>
      </nav>
      <h2>Register a Participant</h2>
      <RegistrationForm sports={sports} institutions={institutions} />
    </main>
  );
}