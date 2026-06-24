import { useRouter } from 'next/navigation';
import styles from './ButtonList.module.css';

type Props = {
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowWeekModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ButtonList(
  { isUpdating, setIsUpdating, isDeleting, setIsDeleting, setShowWeekModal }: Props
) {
  const router = useRouter();

  function toggleUpdating() {
    if (isDeleting || !isUpdating) {
      setIsUpdating(true);
      setIsDeleting(false);
    } else {
      setIsUpdating(false);
    }
  }

  function toggleDeleting() {
    if (isUpdating || !isDeleting) {
      setIsDeleting(true);
      setIsUpdating(false);
    } else {
      setIsDeleting(false);
    }
  }
  
  return (
    <div className={styles['btn-list']}>
      <button
        onClick={toggleUpdating}
        className={`${styles['update-btn']} ${isUpdating ? styles['active']: ''}`}
      >
        <i className="fa-solid fa-pen"></i>
      </button>

      <button
        onClick={toggleDeleting}
        className={`${styles['delete-btn']} ${isDeleting ? styles['active'] : ''}`}
      >
        <i className="fa-solid fa-trash"></i>
      </button>

      <button onClick={() => setShowWeekModal(true)} className={styles['weeks-btn']}>
        <i className="fa-regular fa-calendar"></i>
      </button>

      <button onClick={() => router.push('/strikes')} className={styles['strikes-btn']}>
        <i className="fa-solid fa-tachograph-digital"></i>
      </button>
    </div>
  );
}
