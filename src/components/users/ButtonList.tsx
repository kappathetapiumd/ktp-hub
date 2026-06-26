import { useRouter } from 'next/navigation';

import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './ButtonList.module.css';

type Props = {
  user: CurrentUser
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
}

export default function ButtonList(
  {
    user,
    isUpdating,
    setIsUpdating,
    isDeleting,
    setIsDeleting,
    setShowModal,
    isActive
  }: Props
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
        className={`
          ${styles['update-btn']}
          ${isUpdating ? styles['active']: ''}
        `}
      >
        <i className="fa-solid fa-pen"></i>
      </button>

      <button
        onClick={toggleDeleting}
        className={`
          ${styles['delete-btn']}
          ${isDeleting ? styles['active'] : ''}
        `}
      >
        <i className="fa-solid fa-trash"></i>
      </button>

      {user.role === 'OWNER' &&
        <>
          <button
            onClick={() => setShowModal(true)}
            className={styles['weeks-btn']}
          >
            {isActive
              ? <i className="fa-regular fa-calendar"></i>
              : <i className="fa-solid fa-dumpster"></i>}
          </button>

          <button
            onClick={() => isActive
              ? router.push('/users/deleted')
              : router.push('/users')
            }
            className={styles['users-btn']}
          >
            <i className={`fa-solid fa-users${isActive ? '-slash' : ''}`}></i>
          </button>
        </>
      }
    </div>
  );
}
