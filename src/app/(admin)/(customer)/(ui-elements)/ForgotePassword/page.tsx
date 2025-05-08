"use client";

import { useForgotPassword } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const {mutateAsync: forgotPassword} = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const referralUrl  = window.location.origin;
    setLoading(true);
    // Simulasi request
    await forgotPassword({email, referralUrl});
    
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-600 via-yellow-500 to-gray-700 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-2">Lupa Password?</h2>
        <p className="text-center text-gray-500 mb-6">
          Masukkan email untuk menerima link reset password.
        </p>

        {submitted ? (
          <div className="text-green-600 text-center font-medium">
            Link reset telah dikirim ke <span className="font-semibold">{email}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 font-medium"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : 'Kirim Link Reset'}
            </button>
          </form>
        )}
        <button
            type="button"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition duration-200 font-medium mt-3"
            onClick={() => router.push('/')}
          >
            Kembali ke Login
        </button>
      </div>
    </div>
  );
}
