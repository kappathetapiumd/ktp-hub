'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const invalidLogin = password.length < 4 || email.length <= 8 ||
    !email.includes('umd.edu') || !email.includes('@');
  const validSignup = name.trim().split(/\s+/).length >= 2;

  async function handleAuth() {
    const isInvalid = isLogin
      ? invalidLogin
      : invalidLogin || !validSignup;
    if (isSubmitting || isInvalid) return;
    setIsSubmitting(true);

    try {
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
          router.push('/home');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles['login-container']}>
      <section className={styles['login-content']}>
        <h1>Κ Θ Π</h1>

        <div className={styles['login-input']}>
          {!isLogin && (
            <div className={styles['input-group']}>
              <label htmlFor="signup-name">Name</label>
              <input
                id="signup-name"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                placeholder="Full Name"
              />
            </div>
          )}

          <div className={styles['input-group']}>
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              suppressHydrationWarning
            />
          </div>

          <div className={styles['input-group']}>
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
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
                isSubmitting
                || (isLogin ? invalidLogin : invalidLogin || !validSignup)
              }
            >
              {isSubmitting
                ? (isLogin ? 'Signing in…' : 'Registering…')
                : (isLogin ? 'Sign in' : 'Register')}
            </button>
            <p className={styles['account-container']}>
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '
              }
              <button
                type="button"
                onClick={() => !isSubmitting && setIsLogin(!isLogin)}
                className={styles['switch-link']}
                disabled={isSubmitting}
              >
                {isLogin ? 'Register' : 'Sign in'}
              </button>
              
              <br />

              {isLogin &&
                <Link
                  href="/forgot-password"
                  className={styles['forgot-password-link']}
                >
                  Forgot your password?
                </Link>
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
