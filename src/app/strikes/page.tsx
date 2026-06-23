'use client';

import { useMediaQuery } from 'react-responsive';

import { useEffect, useState } from 'react';
import NetworkBackground from '@/components/login/NetworkBackground';
import PledgeSideBar from '@/components/strikes/PledgeSideBar';
import StrikeInput from '@/components/strikes/StrikeInput';
import WeeksSelect from "@/components/strikes/WeeksSelect";
import StrikeHistory from '@/components/strikes/StrikeHistory';
import styles from './page.module.css';
import type { Pledge } from '@/lib/pledges';

export default function Strikes() {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedPledge, setSelectedPledge] = useState('');

  useEffect(() => {
    loadPledges();

    async function loadPledges() {
      const response = await fetch('/api/pledges');

      if (!response.ok) return;

      const pledges = await response.json();
      setPledges(pledges);
    }
  }, []);

  const isMobile = useMediaQuery({ maxWidth: 520 });

  const totalStrikes = pledges.reduce(
    (sum: number, pledge: Pledge) => sum + pledge.strikes,
    0
  );

  return (
    <>
      {/* might dtm - possibly get rid of this, also kinda buggy on ipad, make sure to uninstall react-responsive package too */}
      {!isMobile && <NetworkBackground /> }

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
              selectedPledge={selectedPledge}
            />
            <WeeksSelect
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
            />
          </div>

          <div className={styles['history-wrapper']}>
            <StrikeHistory
              selectedPledge={selectedPledge}
              selectedWeek={selectedWeek}
            />
          </div>
        </section>
      </main>
    </>
  );
}
