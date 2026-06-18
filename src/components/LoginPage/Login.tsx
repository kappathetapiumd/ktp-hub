'use client';

import { useRef } from 'react';
import NetworkBackground from './NetworkBackground';
import './Login.modules.css';

export default function LoginPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <main className="login-container">
      <NetworkBackground />

      <section className="login-content">
        <h1>Κ Θ Π</h1>

        <div className="login-input">
          <div className="input-group">
            <p>Email</p>
            <input type="text" placeholder="Enter your email address" />
          </div>

          <div className="input-group">
            <p>Password</p>
            <input type="password" placeholder="Password" />
          </div>

          <div className="login-btns-container">
            <button className="submit-btn">Submit</button>
            <button className="switch-btn">Create Account</button>
          </div>
        </div>
      </section>
    </main>
  );
}
