"use client"

import Checkbox from '@/components/form/input/Checkbox';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { MdOutlineRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import { decryptData, encryptData } from '@/app/libs/secretSecure';
import { useLogin, useRequestActivation } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';


export default function AuthCustomer() {
  const [captcha, setCaptcha] = useState('');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaStyles, setCaptchaStyles] = useState<{ rotate: number; fontSize: number }[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [isMessage, setIsMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { mutateAsync: loginMutation } = useLogin();
  const { mutateAsync: requestToken } = useRequestActivation();
  const { login } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  
  const refreshString = () => {
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const allCharacters = upperCaseLetters + numbers;
    const captchaLength = 6;
    let captcha = '';

    captcha += upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
    captcha += numbers[Math.floor(Math.random() * numbers.length)];

    for (let i = 2; i < captchaLength; i++) {
        captcha += allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    captcha = captcha.split('').sort(() => 0.5 - Math.random()).join('');
    setCaptcha(captcha);

    // 🔥 Tambahkan ini untuk generate style acak
    const newStyles = Array.from({ length: captchaLength }).map(() => ({
        rotate: Math.random() * 20 - 10,
        fontSize: Math.random() * 0.4 + 1.2
    }));
    setCaptchaStyles(newStyles);
  };

  useEffect(()=>{ setMounted(true);refreshString(); },[]);
  
    if (!mounted) {
      // selama SSR dan sebelum mount, tolak render interaktif
      return null;
    }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const dataForm = {
            identifier: emailOrUsername,
            password,
            rememberMe: isChecked,
        };

        const data = encryptData(dataForm);
        const response = await loginMutation(data); 
        
        const dataDecrypt = decryptData(response.data);
        console.log(dataDecrypt);
        if (dataDecrypt && dataDecrypt.status === 'success') {
            toast.success('Login berhasil!');
            login(dataDecrypt?.token);
            router.push('/home');
        } else {
            toast.error(dataDecrypt?.message || "Login gagal.");
            refreshString();
        }
    } catch (err) {
        let message = "Login gagal.";
        if (axios.isAxiosError(err)) {
          
          if(err.response?.data?.code === 401002) {
            message = err.response?.data?.message;
            setIsModal(true);
            setIsMessage(message);
          }
          message = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        toast.error(message);
        refreshString();
    }finally{
      setIsLoading(false);
      refreshString();
    }
  };

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const referralUrl  = window.location.origin;
    const email = emailOrUsername.toString();

    setIsLoading(true);
    try {
      const response = await requestToken({email, referralUrl });

      if (response?.status === 'success') {
        toast.success(response.message);
      }

    } catch (err) {
      let message = "Token gagal dikirim.";
        if (axios.isAxiosError(err)) {
          
          message = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        toast.error(message);
    } finally {
      setIsLoading(false);
      setIsModal(false);
    }
  };

  if(isLoading){
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <ClipLoader size={50} color="#3b82f6" />
            <h2 className="text-lg font-semibold mb-4">Loading...</h2>
            <p className="mb-4">Mohon tunggu sebentar...</p>
          </div>
        </div>
    )
  }

  return (
    <div className="md:container sm:container md:w-[30%] sm:w-full min-h-screen w-full flex items-center justify-center px-6">
      <div className="w-full">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/images/company/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            SKY Membership
          </h1>
          <div className="flex flex-col justify-start items-start w-full mt-3">
            <p className="text-sm font-semibold dark:text-gray-400">
              Selamat datang kembali!
            </p>
            <p className="text-sm text-slate-400 dark:text-gray-400">
              Login untuk melanjutkan.
            </p>
          </div>
        </div>

        <div className="border-b border-slate-400 w-full my-3"></div>

        <form className="space-y-4 mt-2" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label>Email atau Username</Label>
            <Input
              type="text"
              placeholder="you@example.com"
              defaultValue={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              
            </div>  
            
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white font-bold rounded-md shadow-lg w-[70%] h-12 text-lg tracking-wide"
                style={{
                  letterSpacing: '0.2em',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  transform: 'rotate(-1deg)'
                }}
              >
                {captcha && captchaStyles.length === captcha.length && (
                <div className="...">
                    {captcha.split('').map((char, idx) => (
                    <span
                        key={idx}
                        style={{
                        transform: `rotate(${captchaStyles[idx].rotate}deg)`,
                        fontSize: `${captchaStyles[idx].fontSize}rem`,
                        color: idx % 2 === 0 ? 'gold' : 'white',
                        margin: '0 2px',
                        }}
                    >
                        {char}
                    </span>
                    ))}
                </div>
                )}
              </div>
              <button
                type="button"
                onClick={refreshString}
                className="flex items-center px-3 py-2 text-blue-500 border border-amber-500 rounded-md shadow-md hover:bg-amber-500 hover:text-white transition-all duration-300"
              >
                <MdOutlineRefresh size={20} className="mr-1" />
              </button>
            </div>
            <Input
              type="text"
              placeholder="Masukkan captcha"
              defaultValue={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value)}
              className="bg-slate-100 mt-2"
            />
          </div>

          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ingat saya
              </span>
            </div>

            <Link href="/forgot-password" className="underline text-sm text-blue-600">Lupa password!</Link>
          </div>

          <Button type="submit" className="w-full mt-4">
            Login
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
          Belum punya akun? <Link href="/register" className="text-blue-600 hover:underline">Daftar sekarang</Link>
        </p>
      </div>

      

      {isModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi</h2>
            <p className="mb-4">{isMessage}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleRequestToken}
                className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
              >
                Request Aktifasi
              </button>
              <button
                onClick={() => setIsModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
