"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons/index";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { iconMap } from "@/utils/iconMaps";
import { useTheme } from "@/context/ThemeContext";

type NavItemType = {
  name: string;
  icon?: string; // dari API
  link?: string;
  subMenus?: { name: string; link: string }[];
};

interface JWTPayload {
  roleId: string;
  exp: number;
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItemType[]>([]);
  const { theme } = useTheme();

  /** ✅ Active route checker */
  const isActive = useCallback(
    (path: string) => pathname === path || pathname.startsWith(`${path}/`),
    [pathname],
  );

  /** ✅ Fetch menu dari API */
  useEffect(() => {
    async function fetchMenu() {
      try {
        const token = Cookies.get("refreshToken");

        if (!token) return;

        const payload: JWTPayload = jwtDecode(token);

        const res = await fetch(`/api/menu/${payload.roleId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Gagal ambil menu");
        const MenuData = await res.json();
        const data: NavItemType[] = MenuData.data;
        // console.log("ini Payload? ", data);

        setNavItems(data);
      } catch (err) {
        console.error("Error fetch menu", err);
      }
    }

    fetchMenu();
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✅ Logo */}
      <div
        className={`flex items-end gap-2 py-8 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/" className="flex items-end gap-2">
          <Image
            src={
              theme === "dark"
                ? "/images/company/logo-dark.png" // versi panjang ada text di logonya
                : "/images/company/logo.png" // versi kecil hanya icon
            }
            alt="Logo"
            width={40}
            height={40}
            style={{ width: "auto" }}
          />
          {(isExpanded || isHovered) && (
            <span className="text-xl font-semibold whitespace-nowrap dark:text-white">
              SKY Membership
            </span>
          )}
        </Link>
      </div>

      {/* ✅ Menu */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <h2
            className={`mb-4 flex text-xs text-gray-400 uppercase ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
          >
            {isExpanded || isHovered || isMobileOpen ? (
              "Menu"
            ) : (
              <HorizontaLDots />
            )}
          </h2>

          <ul className="flex flex-col gap-4">
            {navItems.map((nav, index) => (
              <SidebarItem
                key={index}
                nav={nav}
                isActive={isActive}
                isExpanded={isExpanded || isHovered || isMobileOpen}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

/** ✅ Extracted Nav Item */
const SidebarItem: React.FC<{
  nav: NavItemType;
  isActive: (p: string) => boolean;
  isExpanded: boolean;
}> = ({ nav, isActive, isExpanded }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (open && ref.current) {
      setHeight(ref.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  const iconNode = nav.icon ? iconMap[nav.icon] : null;

  if (nav.subMenus && nav.subMenus.length > 0) {
    return (
      <>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`menu-item ${open ? "menu-item-active" : "menu-item-inactive"}`}
        >
          <span>{iconNode}</span>
          {isExpanded && <span className="ml-2">{nav.name}</span>}
          {isExpanded && (
            <ChevronDownIcon
              className={`ml-auto h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </button>
        <div
          ref={ref}
          className="overflow-hidden transition-all duration-300"
          style={{ height }}
        >
          <ul className="mt-2 ml-9 space-y-1">
            {nav.subMenus.map((sub) => (
              <li key={sub.link}>
                <Link
                  href={sub.link}
                  className={`menu-dropdown-item ${isActive(sub.link) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  return (
    <Link
      href={nav.link || "#"}
      className={`menu-item ${isActive(nav.link || "") ? "menu-item-active" : "menu-item-inactive"}`}
    >
      <span>{iconNode}</span>
      {isExpanded && <span className="ml-2">{nav.name}</span>}
    </Link>
  );
};

export default AppSidebar;
