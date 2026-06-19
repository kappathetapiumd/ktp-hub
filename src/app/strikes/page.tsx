'use client';

import { useMediaQuery } from 'react-responsive';

import NetworkBackground from '@/components/login/NetworkBackground';
import PledgeSideBar from '@/components/strikes/PledgeSideBar';
import StrikeInput from '@/components/strikes/StrikeInput';
import WeeksSelect from "@/components/strikes/WeeksSelect";
import StrikeHistory from '@/components/strikes/StrikeHistory';
import styles from './page.module.css';

export default function Strikes() {
  const isMobile = useMediaQuery({ maxWidth: 520 });

  return (
    <>
      {!isMobile && <NetworkBackground /> /* might dtm - possibly get rid of this, also kinda buggy on ipad */ }
      <main className={styles['dashboard']}>

        <aside className={styles['sidebar']}>
          <PledgeSideBar />
        </aside>

        <section className={styles['dashboard-main']}>
          {/* <NetworkBackground /> */}

          <div className={styles['dashboard-controls']}>
            <StrikeInput />
            <WeeksSelect />
          </div>

          <div className={styles['history-wrapper']}>
            <StrikeHistory />
          </div>
        </section>
      </main>
    </>
  );
}
