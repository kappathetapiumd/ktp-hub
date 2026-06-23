import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styles from './StrikeHistory.module.css';
import type { Strike } from '@/lib/strikes';

const strikes = [{
  id: 1,
  amount: 1,
  reason: "didn't follow up on pverma's interview again",
  createdBy: "Nikhil Shyam",
  createdAt: "03/22 • 11:35 PM"
}, {
  id: 2,
  amount: 3,
  reason: "no visor",
  createdBy: "Soumya Jailwala",
  createdAt: "03/23 • 7:04 PM"
}, {
  id: 3,
  amount: -1,
  reason: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut asperiores in enim vero sed aspernatur alias autem natus, saepe fuga cum ut pariatur dolorum magni optio officiis incidunt. Vitae, dolore? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus vero molestias labore mollitia officiis provident aspernatur. Distinctio tenetur at similique assumenda deleniti, doloribus recusandae adipisci minima officiis. Culpa, beatae dignissimos? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus vero molestias labore mollitia officiis provident aspernatur. Distinctio tenetur at similique assumenda deleniti, doloribus recusandae adipisci minima officiis. Culpa, beatae dignissimos? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus vero molestias labore mollitia officiis provident aspernatur. Distinctio tenetur at similique assumenda deleniti, doloribus recusandae adipisci minima officiis. Culpa, beatae dignissimos? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus vero molestias labore mollitia officiis provident aspernatur. Distinctio tenetur at similique assumenda deleniti, doloribus recusandae adipisci minima officiis. Culpa, beatae dignissimos?",
  createdBy: "Aditya Hardikar",
  createdAt: "03/27 • 10:10 AM"
}, {
  id: 4,
  amount: 1,
  reason: "didn't follow up on vermaedit's interview again",
  createdBy: "Nikhil Shyam",
  createdAt: "03/29 • 4:36 PM"
}, {
  id: 5,
  amount: 1,
  reason: "not following up with pratham again",
  createdBy: "Amaar Trisal",
  createdAt: "03/29 • 4:38 PM"
}];

type Props = {
  strikeHistory: Strike[];
  totalStrikesPerWeek: number;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setStrikeId: React.Dispatch<React.SetStateAction<string>>;
}

export default function StrikeHistory(
  { strikeHistory, totalStrikesPerWeek, setShowDeleteModal, setShowEditModal, setStrikeId }: Props
) {
  function handleDelete(id: string) {
    setStrikeId(id);
    setShowDeleteModal(true);
  }

  function handleEdit(id: string) {
    setStrikeId(id);
    setShowEditModal(true);
  }

  return (
    <div className={styles["strike-history-container"]}>
      <h1 className={styles["week-amount"]}>
        Strikes: 
        <span>
          {totalStrikesPerWeek > 0 ? `+${totalStrikesPerWeek}` : totalStrikesPerWeek}
        </span>
      </h1>

      <div className={styles["horizontal-line"]}></div>

      <div className={styles['strike-card-list']}>
        {strikeHistory.map(({ id, amount, reason, createdBy, createdAt }) => {
          return (
            <div
              key={id}
              className={
                `${styles['strike-card']} ${styles[`${amount > 0 ? 'added' : 'removed'}`]}`}
            >
              <div className={styles["strike-event"]}>
                <p className={styles["amount"]}>
                  {amount > 0 ? `+${amount}` : amount}
                </p>

                <div className={styles["vertical-line"]}></div>

                <div className={styles["strike-content"]}>
                  <p className={styles["reason"]}>{reason}</p>

                  <div className={styles["footer"]}>
                    <div className={styles["update-btns"]}>
                      <button
                        onClick={() => handleDelete(id)}
                        className={styles["delete-btn"]}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleEdit(id)}
                        className={styles["edit-btn"]}
                      >
                        Edit
                      </button>
                    </div>

                    <div className={styles["meta"]}>
                      <span className={styles["name"]}>{createdBy}</span>
                      {/* <span className={styles["date"]}>{createdAt}</span> */}
                      <span className={styles["date"]}>{formatDate(createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return dayjs(date).format('MM/D • h:mm A')
}
