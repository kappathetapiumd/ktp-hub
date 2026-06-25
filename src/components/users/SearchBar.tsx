import { useEffect, useState } from 'react';

import type { User } from '@/lib/users';

import styles from './SearchBar.module.css';

type Props = {
  isActive: boolean,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

export default function SearchBar({ isActive, setUsers }: Props) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const params = new URLSearchParams({
        search,
      });

      const response = await fetch(
        `/api/users${!isActive ? '/deleted' : ''}?${params.toString()}`
      );

      if (!response.ok) return;

      const filteredUsers = await response.json();

      setUsers(filteredUsers);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <input
      onChange={e => setSearch(e.target.value)}
      value={search}
      placeholder='Search...'
      className={styles['search-bar']}
      suppressHydrationWarning
    />
  );
}
