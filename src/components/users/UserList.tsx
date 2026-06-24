import styles from './UserList.module.css';

const users = [{
  id: '1',
  email: 'nshyam@terpmail.umd.edu',
  name: 'Nikhil Shyam',
  role: 'ADMIN',
  membershipCommittee: true
}, {
  id: '2',
  email: 'at@terpmail.umd.edu',
  name: 'Amaar Trisal',
  role: 'BROTHER',
  membershipCommittee: true
}, {
  id: '3',
  email: 'as@terpmail.umd.edu',
  name: 'Ajay Singaraju',
  role: 'BROTHER',
  membershipCommittee: false
}, {
  id: '4',
  email: 'ec@terpmail.umd.edu',
  name: 'Emma Cho',
  role: 'PCP_PCVP',
  membershipCommittee: false
}, {
  id: '5',
  email: 'rp@terpmail.umd.edu',
  name: 'Rishi Sinu Pillai',
  role: 'PLEDGE',
  membershipCommittee: false
}, {
  id: '6',
  email: 'pv@terpmail.umd.edu',
  name: 'Pratham Verma',
  role: 'NONE',
  membershipCommittee: false
}];

// add OWNER to prisma schema

export default function UserList() {
  return (
    <div className={styles['user-list']}>
      {users.map(({ id, email, name, role, membershipCommittee }) => (
        <div key={id} className={styles['user-card']}>
          <div className={styles['user-info']}>
            <span className={styles['name']}>{name}</span>
            <span className={styles['email']}>{email}</span>
          </div>

          <span className={`${styles['role']} ${styles[`${role.toLowerCase()}`]}`}>
            {role !== 'PCP_PCVP' ? role : 'PCP/PCVP'}
          </span>

          <button className={styles['membership-toggle']}>
            <i className={`fa-${membershipCommittee ? 'solid fa-square-check' : 'regular fa-square'}`}></i>
          </button>
        </div>
      ))}
    </div>
  );
}
