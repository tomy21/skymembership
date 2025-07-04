"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function HomeHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const userName = "John Doe";

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleLogout = () => console.log("Logout clicked");

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "List Members", href: "/members" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="grid grid-cols-3 items-center px-4 py-3">
        {/* Kiri: Logo */}
        <div className="flex items-end space-x-2 text-gray-700">
          <Image
            src="/images/company/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Tengah: Nav Link */}
        <nav className="hidden justify-center space-x-6 text-sm font-medium text-gray-600 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative transition hover:text-blue-600 ${
                pathname === link.href ? "font-semibold text-blue-600" : ""
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded bg-blue-600"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Kanan: Cart + User */}
        <div className="flex items-center justify-end space-x-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-gray-700 transition hover:text-blue-600"
            >
              {/* Inisial bulat */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {getInitials(userName)}
              </div>
              <span className="hidden sm:inline">{userName}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-md">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <FaSignOutAlt className="text-sm" />
                    Logout
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
