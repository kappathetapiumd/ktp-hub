import styles from '@/components/navigation/NavigationProgress.module.css';

export default function Loading() {
  return (
    <div
      className={`${styles['progress']} ${styles['active']}`}
      role="progressbar"
      aria-label="Loading page"
    >
      <span />
    </div>
  );
}
