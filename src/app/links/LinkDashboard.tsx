'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CurrentUser } from '@/lib/auth/currentUser';

import styles from './LinkDashboard.module.css';

type Props = {
  user: CurrentUser
}

type Link = {
  id: string;
  label: string;
  url: string;
}

export default function LinkDashboard({ user }: Props) {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const canManageLinks = user.role === 'ADMIN' || user.role === 'OWNER';

  function addLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanLabel = label.trim();
    const cleanUrl = url.trim();
    if (!cleanLabel || !cleanUrl) return;

    setLinks(currentLinks => [
      ...currentLinks,
      { id: crypto.randomUUID(), label: cleanLabel, url: cleanUrl },
    ]);
    setLabel('');
    setUrl('');
  }

  function deleteLink(id: string) {
    setLinks(currentLinks => currentLinks.filter(link => link.id !== id));
  }

  return (
    <main className={styles.dashboard}>
      <div className={styles['background-glow']} aria-hidden="true" />

      <section className={styles.panel}>
        <header className={styles.header}>
          <div className={styles['title-icon']} aria-hidden="true">
            <i className="fa-solid fa-link" />
          </div>
          <div>
            <p className={styles.eyebrow}>Chapter resources</p>
            <h1>Quick Links</h1>
            <p className={styles.subtitle}>
              Everything important, all in one place.
            </p>
          </div>
          <span className={styles.count}>
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
        </header>

        <div className={styles['links-container']}>
          {links.length === 0 ? (
            <div className={styles['empty-state']}>
              <span className={styles['empty-icon']} aria-hidden="true">
                <i className="fa-solid fa-compass" />
              </span>
              <h2>No links yet</h2>
              <p>
                {canManageLinks
                  ? 'Add the first resource using the form below.'
                  : 'Helpful chapter resources will show up here.'}
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {links.map(({ id, label: linkLabel, url: linkUrl }) => (
                <article key={id} className={styles['link-card']}>
                  <a
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span className={styles['link-icon']} aria-hidden="true">
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                    </span>
                    <span className={styles['link-copy']}>
                      <strong>{linkLabel}</strong>
                      <small>{linkUrl}</small>
                    </span>
                    <i className={`fa-solid fa-chevron-right ${styles.chevron}`} aria-hidden="true" />
                  </a>

                  {canManageLinks && (
                    <button
                      type="button"
                      onClick={() => deleteLink(id)}
                      className={styles['delete-link']}
                      aria-label={`Delete ${linkLabel}`}
                      title="Delete link"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        {canManageLinks && (
          <form className={styles['link-input']} onSubmit={addLink}>
            <div className={styles['composer-heading']}>
              <span aria-hidden="true"><i className="fa-solid fa-plus" /></span>
              <div>
                <strong>Add a new link</strong>
                <small>Share a resource with everyone</small>
              </div>
            </div>

            <div className={styles.fields}>
              <label>
                <span>Label</span>
                <input
                  type="text"
                  value={label}
                  onChange={event => setLabel(event.target.value)}
                  placeholder="e.g. Chapter calendar"
                  aria-label="Link label"
                />
              </label>
              <label className={styles['url-field']}>
                <span>URL</span>
                <input
                  type="url"
                  value={url}
                  onChange={event => setUrl(event.target.value)}
                  placeholder="https://example.com"
                  aria-label="Link URL"
                />
              </label>
              <button type="submit" disabled={!label.trim() || !url.trim()}>
                <i className="fa-solid fa-plus" aria-hidden="true" />
                <span>Add link</span>
              </button>
            </div>
          </form>
        )}
      </section>

      <button
        type="button"
        onClick={() => router.push('/strikes')}
        className={styles['strikes-btn']}
        aria-label="Return to strike dashboard"
        title="Strike dashboard"
      >
        <i className="fa-solid fa-user-xmark" aria-hidden="true" />
        <span>Strike dashboard</span>
      </button>
    </main>
  );
}
