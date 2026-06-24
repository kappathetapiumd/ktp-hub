import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles['footer']}>
      <span className={styles['content']}>
        Made by Nikhil • Omicron
      </span>
    </footer>
  );
}
