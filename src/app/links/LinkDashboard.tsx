'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [search, setSearch] = useState('');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  const canManageLinks = user.role === 'ADMIN' || user.role === 'OWNER';
  const canAddLink = label.trim() && url.trim();

  const filteredLinks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) return links;

    return links.filter(link =>
      link.label.toLocaleLowerCase().includes(query)
      || link.url.toLocaleLowerCase().includes(query)
    );
  }, [links, search]);

  useEffect(() => {
    loadLinks();

    async function loadLinks() {
      const response = await fetch('/api/links');

      if (!response.ok) return;

      const links = await response.json();
      setLinks(links);
    }
  }, []);

  async function addLink() {
    const cleanLabel = label.trim();
    const cleanUrl = url.trim();
    if (!cleanLabel || !cleanUrl) return;

    const response = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label,
        url
      })
    });

    if (!response.ok) return;

    const newLink = await response.json();

    setLinks(prev => [...prev, newLink]);

    setLabel('');
    setUrl('');
  }

  async function deleteLink(id: string) {
    const params = new URLSearchParams({
      id
    });

    const response = await fetch(`/api/links?${params.toString()}`, {
      method: 'DELETE'
    });

    if (!response.ok) return;

    setLinks(prev => prev.filter(link => link.id !== id));
  }

  return (
    <main className={styles['dashboard']}>
      <div className={styles['background-glow']}/>

      <div className={styles['panel']}>
        <header className={styles['header']}>
          <div className={styles['title-icon']}>
            <i className="fa-solid fa-link" />
          </div>
          <div>
            <p className={styles['eyebrow']}>Chapter resources</p>
            <h1>Quick Links</h1>
            <p className={styles['subtitle']}>
              Everything important for your reference.
            </p>
          </div>
          <span className={styles['count']}>
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
        </header>

        <div className={styles['search-bar-container']}>
          <div className={styles['search-shell']}>
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search links..."
              aria-label="Search links"
              className={styles['search-bar']}
            />
          </div>
        </div>

        <div className={styles['links-container']}>
          {links.length === 0 ? (
            <div className={styles['empty-state']}>
              <span className={styles['empty-icon']}>
                <i className="fa-solid fa-compass" />
              </span>
              <h2>No links yet</h2>
              <p>
                {canManageLinks
                  ? 'Add the first resource using the form below.'
                  : 'Helpful chapter resources will show up here.'}
              </p>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className={styles['empty-state']}>
              <span className={styles['empty-icon']}>
                <i className="fa-solid fa-magnifying-glass" />
              </span>
              <h2>No Matching Links</h2>
              <p>Try searching for a different label or URL.</p>
            </div>
          ) : (
            <div className={styles['grid']}>
              {filteredLinks.map(({ id, label: linkLabel, url: linkUrl }) => (
                <div key={id} className={styles['link-card']}>
                  <a
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['link']}
                  >
                    <span className={styles['link-icon']}>
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                    </span>
                    <span className={styles['link-copy']}>
                      <strong>{linkLabel}</strong>
                      <small>{linkUrl}</small>
                    </span>
                    <i
                      className={`
                        fa-solid fa-chevron-right ${styles['chevron']}
                      `}
                    ></i>
                  </a>

                  {canManageLinks && (
                    <button
                      onClick={() => deleteLink(id)}
                      className={styles['delete-link']}
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {canManageLinks && (
          <div className={styles['link-input']}>
            <div className={styles['composer-heading']}>
              <span><i className="fa-solid fa-plus" /></span>
              <div>
                <strong>Add a new link</strong>
                <small>Share a resource with everyone</small>
              </div>
            </div>

            <div className={styles['fields']}>
              <label>
                <span>Label</span>
                <input
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  onKeyDown={
                    e => (canAddLink && e.key === 'Enter') && addLink()
                  }
                  placeholder="e.g. Chapter Calendar"
                />
              </label>
              <label className={styles['url-field']}>
                <span>URL</span>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={
                    e => (canAddLink && e.key === 'Enter') && addLink()
                  }
                  placeholder="https://example.com"
                />
              </label>
              <button
                onClick={addLink}
                disabled={!canAddLink}
              >
                <i className="fa-solid fa-plus" />
                <span>Add link</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => router.push('/strikes')}
        className={styles['strikes-btn']}
      >
        <i className="fa-solid fa-user-xmark"/>
        <span>Strike Dashboard</span>
      </button>
    </main>
  );
}
