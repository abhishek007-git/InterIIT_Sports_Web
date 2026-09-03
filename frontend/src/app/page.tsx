export default async function Home() {
  let backendMessage = "Could not reach backend";

  try {
    const res = await fetch('http://localhost:3001', { cache: 'no-store' });
    backendMessage = await res.text();
  } catch {
    // backend isn't running yet — that's fine for now
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Sports Meet Platform</h1>
      <p>Frontend is running ✅</p>
      <p>Backend says: {backendMessage}</p>
    </main>
  );
}