'use client';

import PledgeSideBar from '@/components/strikes/PledgeSideBar';
import StrikeInput from '@/components/strikes/StrikeInput';
import WeeksSelect from "@/components/strikes/WeeksSelect";
import StrikeHistory from '@/components/strikes/StrikeHistory';
import styles from './page.module.css';

export default function Strikes() {
  return (
    <main className={styles['dashboard']}>
      <aside className={styles['sidebar']}>
        {/* <PledgeSideBar /> */}
      </aside>

      <section className={styles['dashboard-main']}>
        <div className={styles['dashboard-controls']}>
          <StrikeInput />
          <WeeksSelect />
        </div>

        <div className={styles['history-wrapper']}>
          <StrikeHistory />
        </div>
      </section>
    </main>
  );
}
