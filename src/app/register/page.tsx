"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      setError('Please fill required fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Sign in the user automatically (best-effort)
      try {
        const signInResult = await signIn('credentials', {
          redirect: false,
          email: form.email,
          password: form.password,
        } as any);

        // @ts-ignore
        if (signInResult?.error) {
          // If sign in failed, send user to login page
          router.push('/login');
        } else {
          router.push('/');
        }
      } catch (err: any) {
        console.error('Sign in error:', err);
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-medium mb-6">Create an account</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} className="px-3 py-2 border rounded" required />
          <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} className="px-3 py-2 border rounded" required />
        </div>

        <div className="mt-4">
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
        </div>

        <div className="mt-4">
          <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="mt-4">
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
        </div>

        <div className="mt-6">
          <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-3 rounded">
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
}
