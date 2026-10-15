
import React, { useState } from 'react';

export default function AuthModal({ initialMode, onClose, onSubmit }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({ name, email, password, mode });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative w-full max-w-md rounded-3xl bg-[#FAF8F5] p-7 sm:p-9 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close authentication form"
          className="absolute right-5 top-4 text-2xl text-gray-500 hover:text-black disabled:opacity-50"
        >
          ×
        </button>

        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
            EF
          </div>

          <h2 id="auth-title" className="text-2xl font-bold text-[#121316]">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>

          <p className="mt-2 text-sm text-[#6B6B75]">
            {isSignup
              ? 'Join EventFlow and discover your next experience.'
              : 'Log in to continue exploring events.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label htmlFor="auth-name" className="mb-1.5 block text-sm font-semibold">
                Full name
              </label>

              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-sm font-semibold">
              Email address
            </label>

            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="mb-1.5 block text-sm font-semibold">
              Password
            </label>

            <input
              id="auth-password"
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
              minLength={isSignup ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
              className="w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#4F46E5] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : isSignup
                ? 'Create account'
                : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B6B75]">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            disabled={loading}
            onClick={() => switchMode(isSignup ? 'login' : 'signup')}
            className="font-semibold text-[#4F46E5] hover:underline"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
