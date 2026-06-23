import styles from './StrikeInput.module.css';

// Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro officiis natus dolor vero repellat rem, autem quod dolorem amet ratione est voluptas, harum perspiciatis nobis sequi magni, eum corrupti praesentium.

type Props = {
  reason: string,
  setReason: React.Dispatch<React.SetStateAction<string>>
  amount: string,
  setAmount: React.Dispatch<React.SetStateAction<string>>
}

export default function StrikeInput({ reason, setReason, amount, setAmount }: Props) {
  return (
    <>
      <div className={styles['strike-input-container']}>
        <div className={styles['strike-content']}>
          <textarea
            onChange={e => setReason(e.target.value)}
            value={reason}
            className={styles['reason-input']}
            placeholder="Reason"
            rows={1}
            suppressHydrationWarning
          />

          <input
            onChange={e => setAmount(e.target.value)}
            value={amount}
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
