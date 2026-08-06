'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import NetworkBackground from '@/components/background/NetworkBackground';
import ZeroStrikesModal from '@/components/strikes/modal/ZeroStrikesModal';
import DeleteModal from '@/components/strikes/modal/DeleteModal';
import EditModal from '@/components/strikes/modal/EditModal';
import PledgeSideBar from '@/components/strikes/PledgeSideBar';
import StrikeInput from '@/components/strikes/StrikeInput';
import WeeksSelect from "@/components/strikes/WeeksSelect";
import StrikeHistory from '@/components/strikes/StrikeHistory';

import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';
import type { CurrentUser } from '@/lib/auth/currentUser'; 

import styles from './StrikeDashboard.module.css';

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

  // load the list of pledges
  useEffect(() => {
    loadPledges();

    async function loadPledges() {
      const response = await fetch('/api/pledges');

      if (!response.ok) return;

      const pledges = await response.json();
      setPledges(pledges);
    }
  }, []);

  // load the weeksD
  useEffect(() => {
    loadWeeks();

    async function loadWeeks() {
      const response = await fetch('/api/weeks');

      if (!response.ok) return;

      const weeks = await response.json();
      setWeeks(weeks);
    }
  }, []);

  // get the strike history any time a new pledge/week is selected
  useEffect(() => {
    if (!selectedPledge) return;

    loadStrikeHistory();

    async function loadStrikeHistory() {
      const params = new URLSearchParams({
        pledgeId: selectedPledge,
        week: selectedWeek
      });

      const response = await fetch(`/api/strikes?${params.toString()}`);

      if (!response.ok) return;

      const { strikeHistory, totalStrikesPerWeek } = await response.json();

      setTotalStrikesPerWeek(totalStrikesPerWeek);

      if (strikeHistory)
        setStrikeHistory(strikeHistory);
    }
  }, [selectedPledge, selectedWeek]);

  const isMobile = useMediaQuery({ maxWidth: 520 });

  const totalStrikes = pledges.reduce(
    (sum, pledge) => sum + pledge.strikes,
    0
  );

  const currentPledge = pledges.find(pledge => pledge.id === selectedPledge);

  return (
    <>
      {/* might dtm - possibly get rid of this, also kinda buggy on ipad, make sure to uninstall react-responsive package too */}
      {!isMobile && <NetworkBackground />}

      {showStrikesModal &&
        <ZeroStrikesModal
          currentPledge={currentPledge}
          showModal={setShowStrikesModal}
        />
      }

      {showDeleteModal &&
        <DeleteModal
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

      <main className={styles['dashboard']}>
        <aside className={styles['sidebar']}>
          <PledgeSideBar
            user={user}
            pledges={pledges}
            totalStrikes={totalStrikes}
            selectedPledge={selectedPledge}
            setSelectedPledge={setSelectedPledge}
            showSideBar={showSideBar}
            setShowSideBar={setShowSideBar}
          />
        </aside>

        <section
          onClick={() => isMobile && setShowSideBar(false)}
          className={styles['dashboard-main']}
        >
          <div className={styles['dashboard-controls']}>
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
            <WeeksSelect
              weeks={weeks}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
            />
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
            />
          </div>
        </section>
      </main>
    </>
  );
}
