'use client';

import Link from 'next/link';
import { useState } from 'react';

import styles from './PasswordPage.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const invalidEmail = email.length <= 8 ||
    !email.includes('umd.edu') || !email.includes('@');

  async function sendEmail() {
    setIsSubmitted(true);
    
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase()
      })
    });
  }

  return (
    <main className={styles['page-container']}>
      <section className={styles['auth-card']}>
        <Link href="/" className={styles['brand']}>
          Κ Θ Π
        </Link>

        {isSubmitted ? (
          <div className={styles['success-content']} role="status">
            <div className={styles['success-icon']}>✓</div>
            <h1 className={styles['title']}>Check your inbox</h1>
            <p className={styles['description']}>
              If an account exists for <strong>{email}</strong>, an email with
              password reset instructions has been sent.
            </p>
            <p className={styles['helper-text']}>
              Be sure to check your spam folder if you do not see it.
            </p>
            <button
              className={styles['secondary-button']}
              onClick={() => setIsSubmitted(false)}
            >
              Try another email
            </button>
          </div>
        ) : (
          <>
            <div className={styles['heading-group']}>
              <p className={styles['eyebrow']}>Account recovery</p>
              <h1 className={styles['title']}>Forgot your password?</h1>
              <p className={styles['description']}>
                Enter the email associated with your account and we will send
                you a link to reset your password.
              </p>
            </div>

            <div className={styles['form']}>
              <div className={styles['input-group']}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  autoComplete="email"
                />
              </div>

              <button
                onClick={sendEmail}
                onKeyDown={e => 
                  (e.key === 'Enter' && !invalidEmail && sendEmail())
                }
                className={styles['primary-button']}
                disabled={invalidEmail}
              >
                Send Reset Email
              </button>
            </div>
          </>
        )}

        <Link href="/" className={styles['back-link']}>
          <span>←</span> Back to sign in
        </Link>
      </section>
    </main>
  );
}
