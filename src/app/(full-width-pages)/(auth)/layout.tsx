import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-white p-6 sm:p-0 dark:bg-gray-900">
      <ThemeProvider>
        <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
          {children}

          {/* Side Background with Overlay */}
          <div className="relative hidden h-full w-full place-items-center lg:grid lg:w-1/2">
            {/* Background Image */}
            <div className="absolute inset-0 bg-black bg-cover bg-center" />

            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* GridShape and Logo content */}
            <div className="relative z-10 flex flex-col items-center space-y-6 px-6 text-white">
              <GridShape />

              <Image
                width={300}
                height={60}
                src="/images/company/logo.png"
                alt="Logo"
                className="drop-shadow-lg"
              />

              <p className="text-center text-lg text-white/80">
                Dashboard{" "}
                <span className="font-semibold text-white">SKY Parking</span>{" "}
                Admin
              </p>
            </div>
          </div>

          {/* Theme Toggler */}
          <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
