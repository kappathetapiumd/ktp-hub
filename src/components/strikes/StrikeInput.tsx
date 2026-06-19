import styles from './StrikeInput.module.css';

// Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro officiis natus dolor vero repellat rem, autem quod dolorem amet ratione est voluptas, harum perspiciatis nobis sequi magni, eum corrupti praesentium.

export default function StrikeInput() {
  return (
    <>
      <div className={styles['strike-input-container']}>
        <div className={styles['strike-content']}>
          <textarea
            className={styles['reason-input']}
            placeholder="Reason"
            rows={1}
            suppressHydrationWarning
          />

          <input
            type="text"
            className={styles['amount-input']}
            inputMode="numeric"
            placeholder="#"
            suppressHydrationWarning
          />
        </div>

        <button className={styles['add-btn']}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
    </>
  );
}
