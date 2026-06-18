import NetworkBackground from './NetworkBackground';
import './Login.modules.css';

export default function LoginPage() {
  return (
    <div className="login-page">
      <NetworkBackground />

      <div className="login-content">
        <h1 className="gradient-text">Κ Θ Π</h1>

        <div className="login-container">
          <div>
            <p>Email</p>
            <input type="text" placeholder="Enter your email address" />
          </div>
          <div>
            <p>Password</p>
            <input type="password" placeholder="Password" />
          </div>

          <div className="secondary-btns-container">
            <button className="submit-btn">
              Submit
            </button>
            <button className="switch-btn">
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
