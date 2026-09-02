"use client";

import React from "react";
import Image from "next/image";

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
      {/* Gambar dengan animasi floating */}
      <div className="animate-float mb-8">
        <Image
          src="/images/company/logo.png" // Pastikan file ada di public/
          alt="Coming Soon"
          width={150}
          height={150}
        />
      </div>

      {/* Text Coming Soon dengan typing loop */}
      <div className="text-center">
        <h1 className="typing-animation mb-4 font-mono text-5xl font-bold">
          COMING SOON
        </h1>
        <p className="text-lg text-gray-400">
          We are building something great.
        </p>
      </div>

      <style jsx>{`
        .typing-animation {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid white;
          animation:
            typing 3s steps(12, end) infinite,
            blink-caret 0.75s step-end infinite;
        }

        @keyframes typing {
          0% {
            width: 0;
          }
          50% {
            width: 13ch;
          }
          100% {
            width: 0;
          }
        }

        @keyframes blink-caret {
          0%,
          100% {
            border-color: transparent;
          }
          50% {
            border-color: white;
          }
        }

        /* Gambar floating animation */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
