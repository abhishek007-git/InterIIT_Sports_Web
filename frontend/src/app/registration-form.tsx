'use client';

import { useState } from 'react';

type Discipline = { id: string; name: string };
type Sport = { id: string; name: string; formatType: string; maxDisciplines: number; disciplines: Discipline[] };
type Institution = { id: string; name: string };

export default function RegistrationForm({ sports, institutions }: { sports: Sport[]; institutions: Institution[] }) {
  const [form, setForm] = useState({
    name: '', registrationNo: '', gender: '', mobile: '', email: '',
    foodPreference: 'veg', bloodGroup: '', arrivalAt: '', departureAt: '',
    emergencyContact: '', institutionId: '', sportId: '',
    disciplineIds: [] as string[], weightCategory: '',
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedSport = sports.find((s) => s.id === form.sportId);
  const isWeightCategory = selectedSport?.formatType === 'weight_category';

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleDiscipline(disciplineId: string) {
    setForm((prev) => {
      const alreadyPicked = prev.disciplineIds.includes(disciplineId);
      let next: string[];
      if (alreadyPicked) {
        next = prev.disciplineIds.filter((id) => id !== disciplineId);
      } else if (selectedSport && prev.disciplineIds.length < selectedSport.maxDisciplines) {
        next = [...prev.disciplineIds, disciplineId];
      } else {
        next = prev.disciplineIds;
      }
      return { ...prev, disciplineIds: next };
    });
  }

  function handleSportChange(sportId: string) {
    setForm((prev) => ({ ...prev, sportId, disciplineIds: [] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');
    try {
      const res = await fetch('http://localhost:3001/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          arrivalAt: form.arrivalAt || undefined,
          departureAt: form.departureAt || undefined,
          weightCategory: isWeightCategory ? form.weightCategory : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Something went wrong');
      }
      setStatus('success');
      setForm({
        name: '', registrationNo: '', gender: '', mobile: '', email: '',
        foodPreference: 'veg', bloodGroup: '', arrivalAt: '', departureAt: '',
        emergencyContact: '', institutionId: '', sportId: '',
        disciplineIds: [], weightCategory: '',
      });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid #ccc', padding: '1rem', borderRadius: 8 }}>
      <input placeholder="Full name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
      <input placeholder="Registration number" value={form.registrationNo} onChange={(e) => updateField('registrationNo', e.target.value)} required />
      <input placeholder="Gender" value={form.gender} onChange={(e) => updateField('gender', e.target.value)} required />
      <input placeholder="Mobile number" value={form.mobile} onChange={(e) => updateField('mobile', e.target.value)} required />
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />

      <label>
        Food preference:{' '}
        <select value={form.foodPreference} onChange={(e) => updateField('foodPreference', e.target.value)}>
          <option value="veg">Veg</option>
          <option value="non_veg">Non-veg</option>
        </select>
      </label>

      <input placeholder="Blood group" value={form.bloodGroup} onChange={(e) => updateField('bloodGroup', e.target.value)} required />

      <label>Arrival: <input type="datetime-local" value={form.arrivalAt} onChange={(e) => updateField('arrivalAt', e.target.value)} /></label>
      <label>Departure: <input type="datetime-local" value={form.departureAt} onChange={(e) => updateField('departureAt', e.target.value)} /></label>

      <input placeholder="Emergency contact" value={form.emergencyContact} onChange={(e) => updateField('emergencyContact', e.target.value)} required />

      <label>
        Institution:{' '}
        <select value={form.institutionId} onChange={(e) => updateField('institutionId', e.target.value)} required>
          <option value="">Select institution</option>
          {institutions.map((inst) => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
        </select>
      </label>

      <label>
        Sport:{' '}
        <select value={form.sportId} onChange={(e) => handleSportChange(e.target.value)} required>
          <option value="">Select sport</option>
          {sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
        </select>
      </label>

      {selectedSport && (
        <fieldset>
          <legend>{isWeightCategory ? 'Weight category event' : `Events (pick up to ${selectedSport.maxDisciplines})`}</legend>
          {selectedSport.disciplines.length === 0 && <p>No events added yet for this sport.</p>}
          {selectedSport.disciplines.map((d) => (
            <label key={d.id} style={{ display: 'block' }}>
              <input type="checkbox" checked={form.disciplineIds.includes(d.id)} onChange={() => toggleDiscipline(d.id)} />
              {' '}{d.name}
            </label>
          ))}
        </fieldset>
      )}

      {isWeightCategory && (
        <input placeholder="Weight category (e.g. 55kg)" value={form.weightCategory} onChange={(e) => updateField('weightCategory', e.target.value)} />
      )}

      <button type="submit" disabled={status === 'saving'}>
        {status === 'saving' ? 'Submitting...' : 'Submit registration'}
      </button>
      {status === 'success' && <p style={{ color: 'green' }}>Registered successfully!</p>}
      {status === 'error' && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
}