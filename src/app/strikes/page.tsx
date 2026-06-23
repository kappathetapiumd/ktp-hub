'use client';

import { useMediaQuery } from 'react-responsive';

import { useState } from 'react';
import NetworkBackground from '@/components/login/NetworkBackground';
import PledgeSideBar from '@/components/strikes/PledgeSideBar';
import StrikeInput from '@/components/strikes/StrikeInput';
import WeeksSelect from "@/components/strikes/WeeksSelect";
import StrikeHistory from '@/components/strikes/StrikeHistory';
import styles from './page.module.css';

export default function Strikes() {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [activeWeek, setActiveWeek] = useState('');
  const [activePledge, setActivePledge] = useState('');

  const isMobile = useMediaQuery({ maxWidth: 520 });

  return (
    <>
      {/* might dtm - possibly get rid of this, also kinda buggy on ipad, make sure to uninstall react-responsive package too */}
      {!isMobile && <NetworkBackground /> }

      <main className={styles['dashboard']}>

        <aside className={styles['sidebar']}>
          <PledgeSideBar
            activePledge={activePledge}
            setActivePledge={setActivePledge}
          />
        </aside>

        <section className={styles['dashboard-main']}>
          <div className={styles['dashboard-controls']}>
            <StrikeInput
              reason={reason}
              setReason={setReason}
              amount={amount}
              setAmount={setAmount}
            />
            <WeeksSelect
              activeWeek={activeWeek}
              setActiveWeek={setActiveWeek}
            />
          </div>

          <div className={styles['history-wrapper']}>
            <StrikeHistory
              activePledge={activePledge}
              activeWeek={activeWeek}
            />
          </div>
        </section>
      </main>
    </>
  );
}
