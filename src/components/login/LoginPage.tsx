'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();

  const invalidLogin = password.length < 4 || email.length <= 8 ||
    !email.includes('umd.edu') || !email.includes('@');
  const validSignup = name.trim().split(/\s+/).length >= 2;

  async function handleAuth() {
    let response;

    if (!isLogin) {
      response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: capitalizeName(name),
          password
        })
      });
    } else {
      response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password
        })
      });
    }

    if (!response.ok) return;

    const { success, error, role } = await response.json();

    if (error) {
      router.push(`/limbo?message=${encodeURIComponent(error)}`);
      return;
    }

    if (success) {
      if (!isLogin || role === 'NONE')
        router.push('/limbo')
      else
        router.push('/strikes');
    }
  }

  return (
    <div className={styles['login-container']}>
      <section className={styles['login-content']}>
        <h1>Κ Θ Π</h1>

        <div className={styles['login-input']}>
          {!isLogin && (
            <div className={styles['input-group']}>
              <p>Name</p>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                placeholder="Full Name"
              />
            </div>
          )}

          <div className={styles['input-group']}>
            <p>Email</p>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              suppressHydrationWarning
            />
          </div>

          <div className={styles['input-group']}>
            <p>Password</p>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              type="password"
              placeholder="Password"
              suppressHydrationWarning
            />
          </div>

          <div className={styles['login-btns-container']}>
            <button
              onClick={handleAuth}
              className={styles['submit-btn']}
              disabled={
                isLogin ? (invalidLogin) : (invalidLogin || !validSignup)
              }
            >
              {isLogin ? 'Sign in' : 'Register'}
            </button>
            <p className={styles['account-container']}>
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '
              }
              <a
                onClick={() => setIsLogin(!isLogin)}
                className={styles['switch-link']}
              >
                {isLogin ? 'Register' : 'Sign in'}
              </a>
              
              <br />

              {isLogin &&
                <a
                  onClick={() => {router.push('/forgot-password')}}
                  className={styles['forgot-password-link']}
                >
                  Forgot your password?
                </a>
              }
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function capitalizeName(name: string) {
  return name.trim().split(/\s+/).map(word =>
    word[0].toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}
