"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      } as any);

      // @ts-ignore
      if (result?.error) {
        // @ts-ignore
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-medium mb-6">Sign in</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" placeholder="Email" className="w-full px-3 py-2 border rounded" required />
        </div>
        <div className="mt-4">
          <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" placeholder="Password" className="w-full px-3 py-2 border rounded" required />
        </div>

        <div className="mt-6">
          <button disabled={loading} className="bg-primary text-white px-6 py-3 rounded">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}
