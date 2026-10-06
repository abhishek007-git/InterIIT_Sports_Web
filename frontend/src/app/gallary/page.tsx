import GalleryView from './gallery-view';

type Sport = { id: string; name: string };

async function getSports(): Promise<Sport[]> {
  try {
    const res = await fetch('http://localhost:3001/sports', { cache: 'no-store' });
    return await res.json();
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const sports = await getSports();
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 900 }}>
      <h1>Gallery</h1>
      <GalleryView sports={sports} />
    </main>
  );
}