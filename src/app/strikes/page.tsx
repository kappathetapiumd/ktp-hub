'use client';

import { useMediaQuery } from 'react-responsive';

import { useEffect, useState } from 'react';
import NetworkBackground from '@/components/login/NetworkBackground';
import PledgeSideBar from '@/components/strikes/PledgeSideBar';
import StrikeInput from '@/components/strikes/StrikeInput';
import WeeksSelect from "@/components/strikes/WeeksSelect";
import StrikeHistory from '@/components/strikes/StrikeHistory';
import { DeleteModal, EditModal, ZeroStrikesModal } from '@/components/strikes/Modal';
import styles from './page.module.css';
import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';

export default function Strikes() {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [strikeHistory, setStrikeHistory] = useState<Strike[]>([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedPledge, setSelectedPledge] = useState('');
  const [showStrikesModal, setShowStrikesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [strikeId, setStrikeId] = useState('');

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

  // get the strike history any time a new pledge/week is selected
  useEffect(() => {
    if (!selectedPledge) return;

    loadStrikeHistory();

    async function loadStrikeHistory() {
      const params = new URLSearchParams({
        pledgeId: selectedPledge,
        // week: selectedWeek
        week: '6/20/26 - 6/27/26' // delete for final
      });

      const response = await fetch(`/api/strikes?${params.toString()}`);

      if (!response.ok) return;

      const strikeHistory = await response.json();

      setStrikeHistory(strikeHistory);
    }
  }, [selectedPledge, selectedWeek]);

  const isMobile = useMediaQuery({ maxWidth: 520 });

  const totalStrikes = pledges.reduce(
    (sum, pledge) => sum + pledge.strikes,
    0
  );

  const totalStrikesPerWeek = strikeHistory.reduce(
    (sum, strike) => sum + strike.amount,
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
          pledges={pledges}
          setPledges={setPledges}
          selectedPledge={selectedPledge}
          showModal={setShowEditModal}
          setShowStrikesModal={setShowStrikesModal}
        />
      }

      <main className={styles['dashboard']}>

        <aside className={styles['sidebar']}>
          <PledgeSideBar
            pledges={pledges}
            totalStrikes={totalStrikes}
            selectedPledge={selectedPledge}
            setSelectedPledge={setSelectedPledge}
          />
        </aside>

        <section className={styles['dashboard-main']}>
          <div className={styles['dashboard-controls']}>
            <StrikeInput
              pledges={pledges}
              setPledges={setPledges}
              setStrikeHistory={setStrikeHistory}
              selectedPledge={selectedPledge}
              setShowStrikesModal={setShowStrikesModal}
            />
            <WeeksSelect
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
            />
          </div>

          <div className={styles['history-wrapper']}>
            <StrikeHistory
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
