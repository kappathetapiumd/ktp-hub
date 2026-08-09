import styles from './SearchBar.module.css';

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <input
      type="search"
      onChange={e => setSearch(e.target.value)}
      value={search}
      placeholder='Search...'
      className={styles['search-bar']}
      suppressHydrationWarning
    />
  );
}
