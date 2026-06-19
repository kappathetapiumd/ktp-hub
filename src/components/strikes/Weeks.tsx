import { useRef, useState } from 'react';
import './Weeks.modules.css';

const weeks = [
  "3/2 - 3/8", "3/9 - 3/15", "3/16 - 3/22", "3/23 - 3/29", "3/30 - 4/5",
  "4/6 - 4/12", "4/13 - 4/19", "4/20 - 4/26", "4/27 - 5/3", "5/4 - 5/8"
];

export default function Weeks() {
  const [activeWeek, setActiveWeek] = useState(weeks[0]);
  
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
    element.classList.add('dragging');
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const element = scrollRef.current;
    if (!element || !isMouseDown.current) return;

    const distance = e.pageX - startX.current;

    if (Math.abs(distance) > 5)
      hasDragged.current = true;

    if (hasDragged.current) {
      e.preventDefault();
      element.scrollLeft = scrollLeft.current - distance;
    }
  }

  function stopDragging() {
    isMouseDown.current = false
    scrollRef.current?.classList.remove('dragging');
  }

  return (
    <div
      ref={scrollRef}
      className={'weeks-scroll'}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <div className="weeks-container">
        {weeks.map((week, index) => {
          return (
            <button
              onClick={() => hasDragged.current || setActiveWeek(week)}
              key={week + index}
              className={`week-btn ${activeWeek === week && 'active'}`}
            >
              <span className="week-label">Week {index + 1}</span>
              <span className="week-dates">{week}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
