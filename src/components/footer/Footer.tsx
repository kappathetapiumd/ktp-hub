import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles['footer']}>
      <span className={styles['content']}>
        <a
          href="https://github.com/kappathetapiumd/ktp-hub"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Nikhil • Omicron
        </a>
      </span>
    </footer>
  );
}
