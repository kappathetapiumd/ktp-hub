import UserList from '@/components/users/UserList';
import ButtonList from '@/components/users/ButtonList';
import styles from './page.module.css';

export default function Users() {
  return (
    <div className={styles['users-container']}>
      <div className={styles['user-list-container']}>
        <UserList />
      </div>

      <div className={styles['button-list-container']}>
        <ButtonList />
      </div>
    </div>
  );
}
