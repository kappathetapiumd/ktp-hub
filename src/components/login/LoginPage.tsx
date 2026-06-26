'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import NetworkBackground from '../background/NetworkBackground';

import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter();

  const invalidLogin = password.length < 4 || email.length <= 8 ||
    !email.includes('umd.edu') || !email.includes('@');
  const validRegister = name.trim().split(/\s+/).length >= 2;

  async function handleAuth() {
    if (!isLogin) {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: capitalizeName(name),
          password
        })
      });

      if (!response.ok) return;

      const { success, error, time } = await response.json();

      if (error) {
        setMessage(error);
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
        }, time * 1000);

        return;
      }

      if (success)
        router.push('/strikes')
    }

    if (isLogin) {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'applcation/json' },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) return;

      const { success, error, time } = await response.json();

      if (error) {
        setMessage(error);
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
        }, time * 1000);

        return;
      }

      if (success)
        router.push('/strikes')
    }
  }

  return (
    <div className={styles['login-container']}>
      <NetworkBackground />

      <section className={styles['login-content']}>
        <h1>Κ Θ Π</h1>

        {showMessage &&
          <p className={styles['info-message']}>{message}</p>
        }

        {!showMessage &&
          <div className={styles['login-input']}>
            {!isLogin && (
              <div className={styles["input-group"]}>
                <p>Name</p>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  type="text"
                  placeholder="Full Name"
                />
              </div>
            )}

            <div className={styles["input-group"]}>
              <p>Email</p>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="text"
                placeholder="Email"
                suppressHydrationWarning
              />
            </div>

            <div className={styles["input-group"]}>
              <p>Password</p>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                suppressHydrationWarning
              />
            </div>

            <div className={styles["login-btns-container"]}>
              <button
                onClick={handleAuth}
                className={styles["submit-btn"]}
                disabled={
                  isLogin ? (invalidLogin) : (invalidLogin || !validRegister)
                }
              >
                {isLogin ? 'Sign in' : 'Register'}
              </button>
              <p className={styles["account-container"]}>
                {isLogin
                  ? "Don't have an account? "
                  : 'Already have an account? '
                }
                <a
                  onClick={() => setIsLogin(!isLogin)}
                  className={styles["switch-link"]}
                >
                  {isLogin ? 'Register' : 'Sign in'}
                </a>
              </p>
            </div>
          </div>
        }
      </section>
    </div>
  );
}

function capitalizeName(name: string) {
  return name.trim().split(/\s+/).map(word =>
    word[0].toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}
