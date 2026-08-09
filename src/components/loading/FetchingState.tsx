import styles from './FetchingState.module.css';

type Props = {
  label: string;
  compact?: boolean;
  className?: string;
}

export default function FetchingState(
  { label, compact = false, className = '' }: Props
) {
  return (
    <div
      className={`
        ${styles['fetching']}
        ${compact ? styles['compact'] : ''}
        ${className}
      `}
      role="status"
    >
      <span className={styles['spinner']}>
        <i className="fa-solid fa-arrow-rotate-right" />
      </span>
      <strong>{label}</strong>
      <small>Please wait a moment</small>
    </div>
  );
}
