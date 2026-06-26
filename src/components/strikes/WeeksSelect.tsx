import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';

import styles from './WeeksSelect.module.css';

type Props = {
  weeks: string[],
  selectedWeek: string,
  setSelectedWeek: React.Dispatch<React.SetStateAction<string>>
}

export default function WeeksSelect(
  { weeks, selectedWeek, setSelectedWeek }: Props
) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // select the current week based on today
  useEffect(() => {
    const currentWeek = getCurrentWeek(weeks, dayjs());
    setSelectedWeek(currentWeek);
  }, [weeks]);

  // start horizontal scroll functionality
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const element = scrollRef.current;
    if (!element) return;

    isMouseDown.current = true;
    hasDragged.current = false;
    startX.current = e.pageX;
    scrollLeft.current = element.scrollLeft;
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const element = scrollRef.current;
    if (!element || !isMouseDown.current) return;

    const distance = e.pageX - startX.current;

    if (Math.abs(distance) > 5 && !hasDragged.current) {
      hasDragged.current = true;
      element.classList.add(styles['dragging']);
    }

    if (hasDragged.current) {
      e.preventDefault();
      element.scrollLeft = scrollLeft.current - distance;
    }
  }

  function stopDragging() {
    isMouseDown.current = false;
    hasDragged.current = false;
    scrollRef.current?.classList.remove(styles['dragging']);
  }
  // end horizontal scroll functionality

  return (
    <div className={styles['weeks-frame']}>
      <div
        ref={scrollRef}
        className={styles['weeks-scroll']}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div className={styles["weeks-container"]}>
          {weeks.map((week, index) => (
            <button
              key={week}
              onClick={() => {
                if (hasDragged.current) return;
                setSelectedWeek(week);
              }}
              className={`
                ${styles['week-btn']}
                ${selectedWeek === week ? styles['active'] : ''}
              `}
            >
              <span className={styles["week-label"]}>Week {index + 1}</span>
              <span className={styles["week-dates"]}>{formatWeek(week)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatWeek(week: string) {
  const [start, end] = week.split(' - ');
  return `${start.slice(0, -3)} - ${end.slice(0, -3)}`
}

function getCurrentWeek(weeks: string[], today: dayjs.Dayjs) {
  if (!weeks || weeks.length === 0) return '';

  return [...weeks].reverse().find(week => {
    const [start] = week.split(' - ');
    const startOfWeek = dayjs(start);

    return today.isAfter(startOfWeek) || today.isSame(startOfWeek, 'day');
  })!;
}
