'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const router = useRouter();

  const invalidLogin = password.length < 4 || email.length <= 8 ||
    !email.includes('umd.edu') || !email.includes('@');
  const validSignup = name.trim().split(/\s+/).length >= 2;

  async function handleAuth(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const isInvalid = isLogin ? invalidLogin : invalidLogin || !validSignup;

    if (isSubmitting || isInvalid) return;

    setIsSubmitting(true);
    setRequestError(null);

    try {
      const response = await fetch(
        isLogin ? '/api/auth/signin' : '/api/auth/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            ...(!isLogin && { name: capitalizeName(name) }),
            password
          })
        }
      );

      const result = await readAuthResponse(response);

      if (!response.ok) {
        setRequestError(
          result.error ?? 'Unable to sign in right now. Please try again.'
        );
        return;
      }

      if (result.error) {
        router.push(`/limbo?message=${encodeURIComponent(result.error)}`);
        return;
      }

      if (result.success) {
        if (!isLogin || result.role === 'NONE')
          router.push('/limbo')
        else
          router.push('/home');

        return;
      }

      setRequestError('The server returned an unexpected response. Try again.');
    } catch {
      setRequestError(
        'Could not reach the server. Check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles['login-container']}>
      <section className={styles['login-content']}>
        <div className={styles['brand']}>Κ Θ Π</div>

        <form className={styles['login-input']} onSubmit={handleAuth}>
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
            <div className={styles['password-heading']}>
              <label htmlFor="auth-password">Password</label>
              {isLogin && (
                <Link
                  href="/forgot-password"
                  className={styles['forgot-password-link']}
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              id="auth-password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              suppressHydrationWarning
            />
          </div>

          <div className={styles['login-btns-container']}>
            {requestError && (
              <p className={styles['error-message']} role="alert">
                {requestError}
              </p>
            )}
            <button
              type="submit"
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
            <div className={styles['account-container']}>
              <div className={styles['account-divider']}>
                <span>
                  {isLogin ? 'New to KTP?' : 'Already have an account?'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => !isSubmitting && setIsLogin(!isLogin)}
                className={styles['switch-button']}
                disabled={isSubmitting}
              >
                {isLogin ? 'Create an account' : 'Back to sign in'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

function capitalizeName(name: string) {
  return name.trim().split(/\s+/).map(word =>
    word[0].toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

type AuthResponse = {
  success?: boolean;
  error?: string;
  role?: string;
}

async function readAuthResponse(response: Response): Promise<AuthResponse> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
