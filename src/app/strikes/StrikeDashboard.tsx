'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { pusherClient } from '@/lib/pusher/client';

import ZeroStrikesModal from '@/components/strikes/modal/ZeroStrikesModal';
import DeleteModal from '@/components/strikes/modal/DeleteModal';
import EditModal from '@/components/strikes/modal/EditModal';
import PledgeSideBar from '@/components/strikes/PledgeSideBar';
import StrikeInput from '@/components/strikes/StrikeInput';
import WeeksSelect from "@/components/strikes/WeeksSelect";
import StrikeHistory from '@/components/strikes/StrikeHistory';
import AppNavigation from '@/components/navigation/AppNavigation';

import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';
import type { CurrentUser } from '@/lib/auth/currentUser'; 

import styles from './StrikeDashboard.module.css';
import { addedToThisWeek } from '@/lib/utils';

type Props = {
  user: CurrentUser;
}

export default function StrikeDashboard({ user }: Props) {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [strikeHistory, setStrikeHistory] = useState<Strike[]>([]);
  const [totalStrikesPerWeek, setTotalStrikesPerWeek] = useState(0);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedPledge, setSelectedPledge] = useState('');
  const [showStrikesModal, setShowStrikesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [strikeId, setStrikeId] = useState('');
  const [showSideBar, setShowSideBar] = useState(true);
  const [isLoadingPledges, setIsLoadingPledges] = useState(true);
  const [isLoadingWeeks, setIsLoadingWeeks] = useState(true);
  const [isLoadingStrikeHistory, setIsLoadingStrikeHistory] = useState(false);

  useEffect(() => {
    const channel = pusherClient.subscribe('private-strikes');

    function handleStrikeEvent(
      { pledgeId, userId }: { pledgeId: string; userId: string }
    ) {
      if (user.id !== userId) {
        if (selectedPledge === pledgeId && addedToThisWeek(selectedWeek)) {
          loadStrikeHistory();
        }

        loadPledges();
      }
    }

    channel.bind('strike-created', handleStrikeEvent);
    channel.bind('strike-updated', handleStrikeEvent);
    channel.bind('strike-deleted', handleStrikeEvent);

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe('private-strikes');
    }

    async function loadPledges() {
      setIsLoadingPledges(true);
      try {
        const response = await fetch('/api/pledges');

        if (!response.ok) return;

        const pledges = await response.json();
        setPledges(pledges);
      } finally {
        setIsLoadingPledges(false);
      }
    }

    async function loadStrikeHistory() {
      const params = new URLSearchParams({
        pledgeId: selectedPledge,
        week: selectedWeek
      });

      setIsLoadingStrikeHistory(true);
      try {
        const response = await fetch(`/api/strikes?${params.toString()}`);

        if (!response.ok) return;

        const { strikeHistory, totalStrikesPerWeek } = await response.json();

        setTotalStrikesPerWeek(totalStrikesPerWeek);

        if (strikeHistory)
          setStrikeHistory(strikeHistory);
      } finally {
        setIsLoadingStrikeHistory(false);
      }
    }
  }, [selectedPledge, selectedWeek, user.id]);

  // load the list of pledges
  useEffect(() => {
    loadPledges();

    async function loadPledges() {
      try {
        const response = await fetch('/api/pledges');

        if (!response.ok) return;

        const pledges = await response.json();
        setPledges(pledges);
      } finally {
        setIsLoadingPledges(false);
      }
    }
  }, []);

  // load the weeks
  useEffect(() => {
    loadWeeks();

    async function loadWeeks() {
      try {
        const response = await fetch('/api/weeks');

        if (!response.ok) return;

        const weeks = await response.json();
        setWeeks(weeks);
      } finally {
        setIsLoadingWeeks(false);
      }
    }
  }, []);

  // get the strike history any time a new pledge/week is selected
  useEffect(() => {
    if (!selectedPledge) return;
    const controller = new AbortController();

    loadStrikeHistory();

    async function loadStrikeHistory() {
      const params = new URLSearchParams({
        pledgeId: selectedPledge,
        week: selectedWeek
      });

      setIsLoadingStrikeHistory(true);
      try {
        const response = await fetch(
          `/api/strikes?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) return;

        const { strikeHistory, totalStrikesPerWeek } = await response.json();

        setTotalStrikesPerWeek(totalStrikesPerWeek);

        if (strikeHistory)
          setStrikeHistory(strikeHistory);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError'))
          throw error;
      } finally {
        if (!controller.signal.aborted) setIsLoadingStrikeHistory(false);
      }
    }

    return () => controller.abort();
  }, [selectedPledge, selectedWeek]);

  const isMobile = useMediaQuery({ maxWidth: 520 });

  const totalStrikes = pledges.reduce(
    (sum, pledge) => sum + pledge.strikes,
    0
  );

  const currentPledge = pledges.find(pledge => pledge.id === selectedPledge);

  return (
    <main className={styles['dashboard']}>
      <div className={styles['background-glow']}></div>

      {showStrikesModal &&
        <ZeroStrikesModal
          currentPledge={currentPledge}
          showModal={setShowStrikesModal}
        />
      }

      {showDeleteModal &&
        <DeleteModal
          user={user}
          strikeId={strikeId}
          setStrikeHistory={setStrikeHistory}
          setTotalStrikesPerWeek={setTotalStrikesPerWeek}
          setPledges={setPledges}
          selectedPledge={selectedPledge}
          showModal={setShowDeleteModal}
        />
      }

      {showEditModal &&
        <EditModal
          user={user}
          strikeId={strikeId}
          strikeHistory={strikeHistory}
          setStrikeHistory={setStrikeHistory}
          setTotalStrikesPerWeek={setTotalStrikesPerWeek}
          pledges={pledges}
          setPledges={setPledges}
          selectedPledge={selectedPledge}
          showModal={setShowEditModal}
          setShowStrikesModal={setShowStrikesModal}
          weeks={weeks}
        />
      }

      <aside className={styles['sidebar']}>
        <PledgeSideBar
          user={user}
          pledges={pledges}
          totalStrikes={totalStrikes}
          selectedPledge={selectedPledge}
          setSelectedPledge={setSelectedPledge}
          showSideBar={showSideBar}
          setShowSideBar={setShowSideBar}
          isLoading={isLoadingPledges}
        />
      </aside>

      <AppNavigation
        user={user}
        className={styles['app-navigation']}
        hidden={isMobile && showSideBar}
      />

      <section
        onClick={() => isMobile && setShowSideBar(false)}
        className={styles['dashboard-main']}
      >
        <header className={styles['dashboard-header']}>
          <div className={styles['title-icon']}>
            <i className="fa-solid fa-bolt"></i>
          </div>
          <div className={styles['title-copy']}>
            <p className={styles['eyebrow']}>Accountability center</p>
            <h1>{currentPledge ? currentPledge.name : 'Strike Dashboard'}</h1>
            <p className={styles['subtitle']}>
              {currentPledge
                ? 'Review activity and manage strike history.'
                : 'Select a pledge from the roster to get started.'}
            </p>
          </div>
          <div className={styles['header-stats']}>
            <div className={styles['stat']}>
              <span>{currentPledge?.strikes ?? '—'}</span>
              <small>Total strikes</small>
            </div>
            <div className={styles['stat']}>
              <span>
                {isLoadingStrikeHistory
                  ? '—'
                  : totalStrikesPerWeek > 0
                  ? `+${totalStrikesPerWeek}`
                  : totalStrikesPerWeek}
              </span>
              <small>Selected week</small>
            </div>
          </div>
        </header>

        <div className={styles['dashboard-controls']}>
          <div className={styles['composer-slot']}>
            <StrikeInput
              user={user}
              pledges={pledges}
              setPledges={setPledges}
              setStrikeHistory={setStrikeHistory}
              setTotalStrikesPerWeek={setTotalStrikesPerWeek}
              selectedPledge={selectedPledge}
              setShowStrikesModal={setShowStrikesModal}
              selectedWeek={selectedWeek}
              weeks={weeks}
            />
          </div>
          <div className={styles['weeks-slot']}>
            <WeeksSelect
              weeks={weeks}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
              isLoading={isLoadingWeeks}
            />
          </div>
        </div>

        <div className={styles['history-wrapper']}>
          <StrikeHistory
            user={user}
            strikeHistory={strikeHistory}
            totalStrikesPerWeek={totalStrikesPerWeek}
            setShowDeleteModal={setShowDeleteModal}
            setShowEditModal={setShowEditModal}
            setStrikeId={setStrikeId}
            selectedPledge={selectedPledge}
            isLoading={isLoadingStrikeHistory}
          />
        </div>
      </section>
    </main>
  );
}
