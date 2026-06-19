import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import styles from './WeeksSelect.module.css';

const weeks = [
  "3/2/26 - 3/8/26", "3/9/26 - 3/15/26", "3/16/26 - 3/22/26", "3/23/26 - 3/29/26", "3/30/26 - 4/5/26",
  "4/6/26 - 4/12/26", "4/13/26 - 4/19/26", "4/20/26 - 4/26/26", "4/27/26 - 5/3/26", "5/4/26 - 5/8/26"
];

export default function Weeks() {
  const [activeWeek, setActiveWeek] = useState('');

  useEffect(() => {
    setActiveWeek(getCurrentWeek(weeks, dayjs()));
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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

  return (
    <div
      ref={scrollRef}
      className={styles['weeks-scroll']}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <div className={styles["weeks-container"]}>
        {weeks.map((week, index) => {
          return (
            <button
              onClick={() => {
                if (hasDragged.current) return;
                setActiveWeek(week);
              }}
              key={week + index}
              className={`${styles['week-btn']} ${styles[`${activeWeek === week ? 'active' : ''}`]}`}
            >
              <span className={styles["week-label"]}>Week {index + 1}</span>
              <span className={styles["week-dates"]}>{formatWeek(week)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatWeek(week: string) {
  const [start, end] = week.split(' - ');
  return `${start.slice(0, -3)} - ${end.slice(0, -3)}`
}

function getCurrentWeek(weeks: string[], today: dayjs.Dayjs) {
  return [...weeks].reverse().find(week => {
    const [start] = week.split(' - ');
    const startOfWeek = dayjs(start);

    return today.isAfter(startOfWeek) || today.isSame(startOfWeek, 'day');
  })!;
}
