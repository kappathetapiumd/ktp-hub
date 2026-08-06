'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import UserList from '@/components/requirements/UserList';
import ClearModal from '@/components/requirements/modal/ClearModal';

import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './RequirementDashboard.module.css'
import NetworkBackground from '@/components/background/NetworkBackground';

type Props = {
  user: CurrentUser;
}

type User = {
  id: string;
  name: string;
  role: string;
  philSmallEvent: boolean;
  philBigEvent: boolean;
  profDevEventA: boolean;
  profDevEventB: boolean
}

type GroupTask = {
  id: string;
  name: string;
  completed: boolean;
}

export default function RequirementDashboard({ user }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [groupReqs, setGroupReqs] = useState<GroupTask[]>([]);
  const [newGroupReq, setNewGroupReq] = useState('');
  const [showGroupReqInput, setShowGroupReqInput] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  
  useEffect(() => {
    loadUsers();

    async function loadUsers() {
      const type =
        (user.role === 'OWNER' || user.role === 'ADMIN')
        ? 'all'
        : user.role === 'BROTHER'
        ? 'brothers'
        : 'pledges';

      const params = new URLSearchParams({
        type
      });

      const response = await fetch(`/api/requirements?${params.toString()}`);

      if (!response.ok) return;

      const users = await response.json();
      setUsers(users);
    }
  }, [user.role]);

  useEffect(() => {
    if (user.role !== 'BROTHER')
      loadGroupReqs();

    async function loadGroupReqs() {
      const response = await fetch('/api/requirements/pledge');

      if (!response.ok) return;

      const groupReqs = await response.json();
      setGroupReqs(groupReqs);
    }
  }, [user.role]);

  async function addGroupReq() {
    setNewGroupReq('');

    const response = await fetch('/api/requirements/pledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        req: newGroupReq
      })
    });

    if (!response.ok) return;

    const createdGroupReq = await response.json();

    setGroupReqs(prev => [...prev, createdGroupReq]);
  }

  async function toggleGroupTask(id: string, completed: boolean) {
    const response = await fetch('/api/requirements/pledge', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        completed: !completed
      })
    });

    if (!response.ok) return;

    setGroupReqs(prev =>
      prev.map(groupReq =>
        groupReq.id === id
        ? {...groupReq, completed: !completed}
        : groupReq
      )
    );
  }

  async function deleteGroupTask(id: string) {
    const params = new URLSearchParams({
      id
    });

    const response =
    await fetch(`/api/requirements/pledge?${params.toString()}`, {
      method: 'DELETE'
    });

    if (!response.ok) return;

    setGroupReqs(prev => prev.filter(groupReq => groupReq.id !== id));
  }

  return (
    <>
      <NetworkBackground />

      {showClearModal &&
        <ClearModal
          setUsers={setUsers}
          showModal={setShowClearModal}
        />
      }

      {(user.role === 'ADMIN' || user.role === 'OWNER') &&
        <button
          onClick={() => setShowClearModal(true)}
          className={styles['clear-btn']}
        >
          Clear
        </button>
      }

      <button
        onClick={() => router.push('/strikes')}
        className={styles['strikes-btn']}
        aria-label="Return to strikes"
      >
        <i className="fa-solid fa-user-xmark"></i>
      </button>

      <div className={styles['user-list']}>
        <div className={styles['group-task-slot']}>
          {user.role !== 'BROTHER' && (
            <div className={styles['group-task-section']}>
              <span className={styles['group-task-title']}>
                Group Pledge Tasks
              </span>

              {/* {groupReqs.length > 0 && ( */}
                <div className={styles['group-tasks']}>
                  {groupReqs.map(({ id, completed, name }) => (
                    <div key={id} className={styles['group-task']}>
                      <button
                        onClick={() => toggleGroupTask(id, completed)}
                        disabled={user.role !== 'OWNER'}
                        className={`${styles['task-name']} ${
                          completed
                            ? styles['task-completed']
                            : styles['task-incomplete']
                        }`}
                      >
                        {name}
                      </button>

                      {user.role === 'OWNER' && (
                        <button
                          onClick={() => deleteGroupTask(id)}
                          className={styles['delete-task']}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              {/* )} */}
            </div>
          )}
        </div>

        <div className={styles['headers']}>
          <span className={styles['header']}>Name</span>
          <span className={styles['header']}>
            <span>Small Event</span>
            <span className={styles['header-detail']}>(Philanthropy)</span>
          </span>
          <span className={styles['header']}>
            <span>Big Event</span>
            <span className={styles['header-detail']}>(Philanthropy)</span>
          </span>
          <span className={styles['header']}>
            <span>Event #1</span>
            <span className={styles['header-detail']}>
              (Professional Development)
            </span>
          </span>
          <span className={styles['header']}>
            <span>Event #2</span>
            <span className={styles['header-detail']}>
              (Professional Development)
            </span>
          </span>
        </div>

        <UserList
          user={user}
          users={users}
          setUsers={setUsers}
        />

        <div className={styles['task-control-slot']}>
          {user.role === 'OWNER' && (
            <div className={styles['task-controls']}>
              <button
                onClick={() => setShowGroupReqInput(prev => !prev)}
                className={styles['toggle-task-input']}
              >
                <i
                  className={`
                    fa-solid ${showGroupReqInput ? 'fa-minus' : 'fa-plus'}
                  `}
                ></i>
                {showGroupReqInput ? 'Hide' : 'Add Group Pledge Task'}
              </button>

              {showGroupReqInput &&
                <>
                  <input
                    value={newGroupReq}
                    onChange={e => setNewGroupReq(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addGroupReq()}
                    className={styles['task-input']}
                    placeholder="Enter a group pledge task"
                    maxLength={60}
                  />
                  <button
                    onClick={addGroupReq}
                    disabled={!newGroupReq.trim()}
                    className={styles['add-task']}
                  >
                    Add
                  </button>
                </>
              }
            </div>
          )}
        </div>
      </div>

    </>
  );
}
