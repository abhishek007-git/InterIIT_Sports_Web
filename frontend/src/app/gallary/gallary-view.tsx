'use client';

import { useEffect, useState } from 'react';

type PhotoTag = { id: string; participant: { id: string; name: string } };
type Sport = { id: string; name: string };
type MediaAsset = { id: string; filename: string; sport: { name: string } | null; photoTags: PhotoTag[] };

function PhotoCard({ photo, onTagged }: { photo: MediaAsset; onTagged: () => void }) {
  const [regNo, setRegNo] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleTag() {
    setStatus('saving');
    setErrorMessage('');
    try {
      const lookupRes = await fetch(`http://localhost:3001/participants/lookup/${regNo}`);
      const participant = await lookupRes.json();
      if (!participant) {
        throw new Error('No participant found with that registration number');
      }
      const tagRes = await fetch(`http://localhost:3001/media/${photo.id}/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: participant.id }),
      });
      if (!tagRes.ok) {
        const body = await tagRes.json().catch(() => ({}));
        throw new Error(body.message || 'Could not tag this photo');
      }
      setRegNo('');
      setStatus('idle');
      onTagged();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
      <img src={`http://localhost:3001/uploads/${photo.filename}`} alt="Event photo" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '0.75rem' }}>
        <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>{photo.sport ? photo.sport.name : 'General'}</p>
        {photo.photoTags.length > 0 && (
          <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Tagged: {photo.photoTags.map((t) => t.participant.name).join(', ')}</p>
        )}
        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
          <input placeholder="Your reg. no." value={regNo} onChange={(e) => setRegNo(e.target.value)} style={{ flex: 1, minWidth: 0 }} />
          <button onClick={handleTag} disabled={status === 'saving' || !regNo}>
            {status === 'saving' ? '...' : 'Tag me'}
          </button>
        </div>
        {status === 'error' && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default function GalleryView({ sports }: { sports: Sport[] }) {
  const [photos, setPhotos] = useState<MediaAsset[]>([]);
  const [uploaderName, setUploaderName] = useState('');
  const [sportId, setSportId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  async function loadPhotos() {
    try {
      const res = await fetch('http://localhost:3001/media', { cache: 'no-store' });
      setPhotos(await res.json());
    } catch {
      setPhotos([]);
    }
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploadStatus('saving');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', uploaderName);
      if (sportId) formData.append('sportId', sportId);

      const res = await fetch('http://localhost:3001/media/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      setFile(null);
      setUploadStatus('idle');
      loadPhotos();
    } catch {
      setUploadStatus('error');
    }
  }

  return (
    <div>
      <form onSubmit={handleUpload} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', border: '1px solid #ccc', padding: '1rem', borderRadius: 8 }}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
        <input placeholder="Your name (uploader)" value={uploaderName} onChange={(e) => setUploaderName(e.target.value)} required />
        <select value={sportId} onChange={(e) => setSportId(e.target.value)}>
          <option value="">General / no sport</option>
          {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button type="submit" disabled={uploadStatus === 'saving'}>
          {uploadStatus === 'saving' ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
      {uploadStatus === 'error' && <p style={{ color: 'red' }}>Upload failed — try again.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {photos.map((photo) => <PhotoCard key={photo.id} photo={photo} onTagged={loadPhotos} />)}
      </div>
      {photos.length === 0 && <p>No photos uploaded yet.</p>}
    </div>
  );
}