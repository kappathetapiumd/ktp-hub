'use client';

import { useRef, useState } from 'react';
import { appliesToMember, audienceLabels, audienceShortLabels, type Requirement, type RequirementAudience, type RequirementUser } from '@/lib/requirement-types';
import styles from './RequirementTracker.module.css';

type Props = {
  requirements: Requirement[];
  users: RequirementUser[];
  canManage: boolean;
  setRequirements: React.Dispatch<React.SetStateAction<Requirement[]>>;
  setUsers: React.Dispatch<React.SetStateAction<RequirementUser[]>>;
};

export default function RequirementTracker({ requirements, users, canManage, setRequirements, setUsers }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Requirement | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [appliesTo, setAppliesTo] = useState<RequirementAudience>('ALL');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const pending = useRef(new Set<string>());
  const [pendingKeys, setPendingKeys] = useState(new Set<string>());
  const columns = [...requirements].sort((a, b) =>
    a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );

  function openEditor(req: Requirement | null) {
    setEditing(req); setName(req?.name || ''); setCategory(req?.category || '');
    setAppliesTo(req?.appliesTo || 'ALL'); setFormError('');
    dialog.current?.showModal();
  }
  async function request(options: RequestInit, query = '') {
    const response = await fetch(`/api/requirements${query}`, options);
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.error || 'Could not save changes. Please try again.');
    return data;
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setFormError('');
    try {
      const saved: Requirement = await request({ method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing?.id, name, category, appliesTo }) });
      setRequirements(prev => editing ? prev.map(req => req.id === saved.id ? saved : req) : [...prev, saved]);
      dialog.current?.close();
    } catch (cause) { setFormError((cause as Error).message); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!editing || busy || !window.confirm(`Delete “${editing.name}”? All completion records for this requirement will also be deleted. This cannot be undone.`)) return;
    setBusy(true); setFormError('');
    try {
      await request({ method: 'DELETE' }, `?id=${encodeURIComponent(editing.id)}`);
      setRequirements(prev => prev.filter(req => req.id !== editing.id));
      setUsers(prev => prev.map(user => ({ ...user, completedRequirementIds: user.completedRequirementIds.filter(id => id !== editing.id) })));
      dialog.current?.close();
    } catch (cause) { setFormError((cause as Error).message); }
    finally { setBusy(false); }
  }
  async function toggle(user: RequirementUser, req: Requirement) {
    const key = `${user.id}:${req.id}`;
    if (pending.current.has(key)) return;
    pending.current.add(key); setPendingKeys(new Set(pending.current)); setError('');
    const completed = !user.completedRequirementIds.includes(req.id);
    setUsers(prev => prev.map(member => member.id !== user.id ? member : {
      ...member,
      completedRequirementIds: completed
        ? [...new Set([...member.completedRequirementIds, req.id])]
        : member.completedRequirementIds.filter(id => id !== req.id),
    }));
    try {
      await request({ method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, requirementId: req.id, completed }) });
    } catch (cause) {
      setUsers(prev => prev.map(member => member.id !== user.id ? member : {
        ...member,
        completedRequirementIds: completed
          ? member.completedRequirementIds.filter(id => id !== req.id)
          : [...new Set([...member.completedRequirementIds, req.id])],
      }));
      setError((cause as Error).message);
    }
    finally { pending.current.delete(key); setPendingKeys(new Set(pending.current)); }
  }
  return <section className={styles.tracker} aria-label="Individual requirements">
    <div className={styles.toolbar}>
      <span>Scroll Horizontally to View Requirements</span>
      {canManage && <button onClick={() => openEditor(null)}><i className="fa-solid fa-plus" /> Add Requirement</button>}
    </div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {!requirements.length ? <p className={styles.empty}>No requirements yet.{canManage && ' Add a requirement to start tracking progress.'}</p>
      : <div className={styles.scroll} tabIndex={0} role="region" aria-label="Scrollable requirement tracker">
        <table className={styles.table}>
          <thead>
            <tr><th scope="col" className={styles.member}>Member</th>
              {columns.map(req => <th key={req.id} scope="col" className={styles.heading}>
                <small className={styles.category}>{req.category}</small>
                <span>{req.name}</span>
                <small>{audienceShortLabels[req.appliesTo]}</small>
                {canManage && <button className={styles.edit} title={`Edit ${req.name}`} aria-label={`Edit ${req.name}`} onClick={() => openEditor(req)}><i className="fa-solid fa-pen" /></button>}
              </th>)}
            </tr>
          </thead>
          <tbody>{users.map(user => <tr key={user.id}>
            <th scope="row" className={styles.member}><span className={canManage ? styles[user.role.toLowerCase()] : undefined}>{user.name}</span></th>
            {columns.map(req => <td key={req.id}>{appliesToMember(req, user.role)
              ? <button className={styles.checkbox} aria-pressed={user.completedRequirementIds.includes(req.id)}
                aria-label={`${user.name}: ${req.name} (${req.category})`}
                disabled={!canManage || pendingKeys.has(`${user.id}:${req.id}`)} onClick={() => toggle(user, req)}>
                  <i className={`fa-${user.completedRequirementIds.includes(req.id) ? 'solid fa-square-check' : 'regular fa-square'}`} />
                </button>
              : <span aria-label="Not applicable" title="Not applicable">—</span>}</td>)}
          </tr>)}</tbody>
        </table>
        {!users.length && <p className={styles.empty}>No matching members.</p>}
      </div>}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="requirement-editor-title" onCancel={event => { if (busy) event.preventDefault(); }}>
      <form onSubmit={save}>
        <h2 id="requirement-editor-title">{editing ? 'Edit Requirement' : 'Add Requirement'}</h2>
        <label>Name<input autoFocus required maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Community service event" /></label>
        <label>Category<input required maxLength={80} value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Philanthropy" /></label>
        <label>Applies To<select value={appliesTo} onChange={e => setAppliesTo(e.target.value as RequirementAudience)}>
          {Object.entries(audienceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>
        {formError && <p role="alert" className={styles.error}>{formError}</p>}
        <div className={styles.actions}>
          {editing && <button type="button" className={styles.danger} disabled={busy} onClick={remove}>Delete</button>}
          <button type="button" disabled={busy} onClick={() => dialog.current?.close()}>Cancel</button>
          <button type="submit" disabled={busy || !name.trim() || !category.trim()}>{busy ? 'Saving…' : editing ? 'Save Changes' : 'Add Requirement'}</button>
        </div>
      </form>
    </dialog>
  </section>;
}
