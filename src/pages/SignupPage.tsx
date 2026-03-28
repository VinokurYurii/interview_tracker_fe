import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth.ts';
import { AuthBranding } from '../components/AuthBranding.tsx';
import { ThemeToggleButton } from '../components/ThemeToggleButton.tsx';
import { ApiError } from '../lib/api-client.ts';
import styles from './SignupPage.module.css';

function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
}

function strengthClass(strength: number): string {
  if (strength <= 1) return styles.weak;
  if (strength <= 2) return styles.medium;
  return styles.strong;
}

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors([]);

    if (email.length > 100) {
      setErrors(['Email must be 100 characters or less']);
      return;
    }

    if (password !== passwordConfirmation) {
      setErrors(['Passwords do not match']);
      return;
    }

    setIsSubmitting(true);

    try {
      await signup({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password: password.trim(),
        password_confirmation: passwordConfirmation.trim(),
      });
      navigate('/home');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors);
      } else {
        setErrors(['An unexpected error occurred. Please try again.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <AuthBranding />

      <div className={styles.formContainer}>
        <ThemeToggleButton />

        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h1>Create Account</h1>
            <p>Start tracking your interview journey today</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {errors.length > 0 && (
              <div className={styles.error}>
                {errors.map((err, i) => <div key={i}>{err}</div>)}
              </div>
            )}

            <div className={styles.nameRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>First Name</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Last Name</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email Address</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  className={styles.formInput}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.formInput}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              {password.length > 0 && (
                <>
                  <div className={styles.passwordStrength}>
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`${styles.strengthBar} ${i < passwordStrength ? strengthClass(passwordStrength) : ''}`}
                      />
                    ))}
                  </div>
                  <p className={styles.strengthText}>
                    Use 8+ characters with a mix of letters, numbers &amp; symbols
                  </p>
                </>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Confirm Password</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.formInput}
                  placeholder="Confirm your password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className={styles.formFooter}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
