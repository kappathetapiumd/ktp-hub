'use client';

import { useEffect, useMemo, useState } from 'react';

import UserList from '@/components/requirements/UserList';
import ClearModal from '@/components/requirements/modal/ClearModal';
import FetchingState from '@/components/loading/FetchingState';

import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './RequirementDashboard.module.css'

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
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [groupReqs, setGroupReqs] = useState<GroupTask[]>([]);
  const [newGroupReq, setNewGroupReq] = useState('');
  const [showGroupReqInput, setShowGroupReqInput] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingGroupReqs, setIsLoadingGroupReqs] = useState(
    user.role !== 'BROTHER'
  );
  const [isAddingGroupReq, setIsAddingGroupReq] = useState(false);

  
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

      try {
        const response = await fetch(`/api/requirements?${params.toString()}`);

        if (!response.ok) return;

        const users = await response.json();
        setUsers(users);
      } finally {
        setIsLoadingUsers(false);
      }
    }
  }, [user.role]);

  useEffect(() => {
    if (user.role !== 'BROTHER')
      loadGroupReqs();

    async function loadGroupReqs() {
      try {
        const response = await fetch('/api/requirements/pledge');

        if (!response.ok) return;

        const groupReqs = await response.json();
        setGroupReqs(groupReqs);
      } finally {
        setIsLoadingGroupReqs(false);
      }
    }
  }, [user.role]);

  async function addGroupReq() {
    if (isAddingGroupReq || !newGroupReq.trim()) return;
    setIsAddingGroupReq(true);

    try {
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
      setNewGroupReq('');
    } finally {
      setIsAddingGroupReq(false);
    }
  }

  async function toggleGroupTask(id: string, completed: boolean) {
    setGroupReqs(prev =>
      prev.map(groupReq =>
        groupReq.id === id
          ? { ...groupReq, completed: !completed }
          : groupReq
      )
    );

    await fetch('/api/requirements/pledge', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        completed: !completed
      })
    });
  }

  async function deleteGroupTask(id: string) {
    const params = new URLSearchParams({
      id
    });

    const response =
      await fetch(`/api/requirements/pledge?${params.toString()}`, {
        method: 'DELETE'
      }
    );

    if (!response.ok) return;

    setGroupReqs(prev => prev.filter(groupReq => groupReq.id !== id));
  }

  const completedRequirements = users.reduce((total, currentUser) =>
    total
    + Number(currentUser.philSmallEvent)
    + Number(currentUser.philBigEvent)
    + Number(currentUser.profDevEventA)
    + Number(currentUser.profDevEventB), 0
  );

  const totalRequirements = users.length * 4;

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) return users;

    return users.filter(currentUser => {
      const role = currentUser.role === 'PCP_PCVP'
        ? 'pcp/pcvp'
        : currentUser.role.toLocaleLowerCase();

      return currentUser.name.toLocaleLowerCase().includes(query)
        || role.includes(query);
    });
  }, [search, users]);

  return (
    <main className={styles['dashboard']}>
      <div className={styles['background-glow']}></div>
      
      {showClearModal &&
        <ClearModal
          setUsers={setUsers}
          showModal={setShowClearModal}
        />
      }

      <div className={styles['panel']}>
        <header className={styles['dashboard-header']}>
          <div className={styles['title-icon']}>
            <i className="fa-solid fa-list-check"></i>
          </div>
          <div className={styles['title-copy']}>
            <p className={styles['eyebrow']}>Chapter progress</p>
            <h1>Requirements</h1>
            <p className={styles['subtitle']}>
              All requirements must be met before the end of the semester.
            </p>
          </div>

          <div className={styles['header-actions']}>
            <div className={styles['progress-pill']}>
              <span>{isLoadingUsers ? '—' : completedRequirements}</span>
              <small>
                {isLoadingUsers
                  ? 'fetching progress'
                  : `of ${totalRequirements || 0} complete`}
              </small>
            </div>
            {(user.role === 'ADMIN' || user.role === 'OWNER') &&
              <button
                onClick={() => setShowClearModal(true)}
                className={styles['clear-btn']}
              >
                <i className="fa-solid fa-rotate-left"></i>
                <span>Clear Progress</span>
              </button>
            }
          </div>
        </header>

        <div className={styles['group-task-slot']}>
          {user.role !== 'BROTHER' && user.role !== 'ADMIN' && (
            <div className={styles['group-task-section']}>
              <div className={styles['group-task-heading']}>
                <span className={styles['group-task-icon']}>
                  <i className="fa-solid fa-people-group"></i>
                </span>
                <div>
                  <strong>Group Pledge Tasks</strong>
                  <small>
                    {groupReqs.filter(task => task.completed).length} of {' '}
                    {groupReqs.length} complete
                  </small>
                </div>
              </div>

              <div className={styles['group-tasks']}>
                {isLoadingGroupReqs ? (
                  <FetchingState label="Fetching Group Tasks…" compact />
                ) : groupReqs.map(({ id, completed, name }) => (
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
                      <i
                        className={`fa-solid
                          ${completed ? 'fa-check' : 'fa-hourglass-half'}
                        `}
                      ></i>
                      <span>{name}</span>
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

                {!isLoadingGroupReqs && groupReqs.length === 0 &&
                  <span className={styles['no-tasks']}>No group tasks yet</span>
                }
              </div>
            </div>
          )}
        </div>

        <div className={styles['search-bar-container']}>
          <div className={styles['search-shell']}>
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="search"
              aria-label="Search members"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search members..."
              className={styles['search-bar']}
            />
          </div>
        </div>

        <div className={styles['tracker']}>
          <div className={styles['headers']}>
            <span className={styles['header']}>Member</span>
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

          <div className={styles['user-list']}>
            {isLoadingUsers ? (
              <FetchingState label="Fetching Requirements…" />
            ) : filteredUsers.length === 0 && search.trim() ? (
              <div className={styles['no-results']}>
                <i className="fa-solid fa-magnifying-glass" />
                <strong>No Matching Members</strong>
                <span>Try searching for a different name or role.</span>
              </div>
            ) : (
              <UserList
                user={user}
                users={filteredUsers}
                setUsers={setUsers}
              />
            )}
          </div>
        </div>

        <div className={styles['task-control-slot']}>
          {user.role === 'OWNER' && (
            <div className={styles['task-controls']}>
              <button
                type="button"
                aria-expanded={showGroupReqInput}
                aria-controls="group-task-form"
                onClick={() => setShowGroupReqInput(prev => !prev)}
                className={styles['toggle-task-input']}
              >
                <span><i className="fa-solid fa-plus" /></span>
                <div>
                  <strong>Add a Group Task</strong>
                  <small>Create a shared pledge requirement</small>
                </div>
                <i
                  className={`
                    fa-solid fa-chevron-down ${styles['task-chevron']}
                    ${showGroupReqInput ? styles['task-chevron-open'] : ''}
                  `}
                />
              </button>

              {showGroupReqInput &&
                <div id="group-task-form" className={styles['task-form']}>
                  <label>
                    <span>Task name</span>
                    <input
                      value={newGroupReq}
                      onChange={e => setNewGroupReq(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addGroupReq()}
                      className={styles['task-input']}
                      placeholder="e.g. Music Video"
                      maxLength={60}
                    />
                  </label>
                  <button
                    onClick={addGroupReq}
                    disabled={!newGroupReq.trim() || isAddingGroupReq}
                    className={styles['add-task']}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>{isAddingGroupReq ? 'Adding…' : 'Add task'}</span>
                  </button>
                </div>
              }
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
