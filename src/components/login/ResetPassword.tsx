'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import styles from './PasswordPage.module.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const token = searchParams.get('token');

    if (!token) {
      setError('This password reset link is invalid or incomplete.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password
        })
      });

      if (!response.ok) {
        throw new Error('Unable to reset password.');
      }

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError(
        'We could not reset your password. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles['page-container']}>
      <section className={styles['auth-card']}>
        <Link href="/" className={styles['brand']}>
          Κ Θ Π
        </Link>

        {isLoading ? (
          <div className={styles['success-content']} role="status">
            <div className={styles['success-icon']}>✓</div>
            <h1 className={styles['title']}>Loading...</h1>
            <p className={styles['description']}>
              Please wait as we reset your password.
            </p>
          </div>
        ) : isSubmitted ? (
          <div className={styles['success-content']} role="status">
            <div className={styles['success-icon']}>✓</div>
            <h1 className={styles['title']}>Password updated</h1>
            <p className={styles['description']}>
              Your password has been reset. You can now sign in with your new
              password.
            </p>
            <Link href="/" className={styles['primary-link']}>
              Continue to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className={styles['heading-group']}>
              <p className={styles['eyebrow']}>Account recovery</p>
              <h1 className={styles['title']}>Create a new password</h1>
              <p className={styles['description']}>
                Choose a new password for your account. Make sure it is one you
                do not use elsewhere.
              </p>
            </div>

              <form className={styles['form']} onSubmit={resetPassword}>
              <div className={styles['input-group']}>
                <label htmlFor="new-password">New password</label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter a new password"
                  autoComplete="new-password"
                  minLength={4}
                  required
                />
                <p id="password-hint" className={styles['input-hint']}>
                  Use at least 4 characters.
                </p>
              </div>

              {error && (
                <p
                  id="reset-password-error"
                  className={styles['error-message']}
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={styles['primary-button']}
                disabled={password.length < 4 || isLoading}
              >
                Reset password
              </button>
            </form>
          </>
        )}

        {!isSubmitted && !isLoading && (
          <Link href="/" className={styles['back-link']}>
            <span>←</span> Back to sign in
          </Link>
        )}
      </section>
    </main>
  );
}
