// import { useRouter } from 'next/navigation';
import styles from './ButtonList.module.css';

const isUpdating = false;
const isDeleting = false;

export default function ButtonList() {
  return (
    <div className={styles['btn-list']}>
      <button className={`${styles['update-btn']} ${isUpdating ? styles['active']: ''}`}>
        <i className="fa-solid fa-pen"></i>
      </button>

      <button className={`${styles['delete-btn']} ${isDeleting ? styles['active'] : ''}`}>
        <i className="fa-solid fa-trash"></i>
      </button>

      <button className={styles['weeks-btn']}>
        <i className="fa-regular fa-calendar"></i>
      </button>

      <button className={styles['strikes-btn']}>
        <i className="fa-solid fa-tachograph-digital"></i>
      </button>
    </div>
  );
}
