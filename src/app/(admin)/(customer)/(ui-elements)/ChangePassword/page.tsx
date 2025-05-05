"use client"


import { useChangePassword } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import axios from "axios";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const {mutateAsync: changePassword} = useChangePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
        const response = await changePassword({password:newPassword, confirmPassword: confirmPassword, token: params.get('token') || ''});
        
        if (response?.status === 'success') {
            setSuccess(true);
        }

    } catch (err) {
        let message = "change password gagal.";
        if (axios.isAxiosError(err)) {
            
            message = err.response?.data?.message || err.message;
            console.log(message);
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-gray-600 via-yellow-500 to-gray-700 p-4">

        {success && (
          <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50 p-5'>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
                Password Berhasil Diubah
              </h2>
              <p className="text-center text-gray-500 mb-6">
                Password berhasil diubah, silahkan login kembali.
              </p>
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={() => router.push('/')}
              >
                Login
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50 p-5'>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
                Password Gagal Diubah
              </h2>
              <p className="text-center text-gray-500 mb-6">
                {error}
              </p>
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={() => router.push('/forgot-password')}
              >
                Request kembali
              </button>
            </div>
          </div>
        )}


      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
          Ubah Password
        </h2>

        {/* {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>} */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={newPassword}
              onChange={(e) => { 
                setNewPassword(e.target.value); 
                setPasswordStrength(getPasswordStrength(e.target.value));
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {newPassword && (
                <div className="h-2 bg-gray-300 rounded mt-2">
                    <div
                    className={`h-2 rounded transition-all duration-300 ${
                        passwordStrength <= 2
                        ? "bg-red-500 w-1/3"
                        : passwordStrength === 3
                        ? "bg-yellow-500 w-2/3"
                        : "bg-green-500 w-full"
                    }`}
                    ></div>
                </div>
            )}
          </div>
            

          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 font-medium"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : 'Ubah Password'}
          </button>
        </form>

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
