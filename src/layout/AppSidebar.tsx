"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useTheme } from "@/context/ThemeContext";
import { useDetailAdmin } from "@/hooks/useAuth";
import HorizontaLDots from "@/icons/HorizontaLDots";
import { iconMap } from "@/utils/iconMaps";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon } from "../icons/index";

type NavItemType = {
  name: string;
  icon?: string;
  link?: string;
  subMenus?: {
    name: string;
    link: string;
  }[];
};

interface JWTPayload {
  roleId: string;
  exp: number;
}

const SIDEBAR_EXPANDED = "w-[280px]";
const SIDEBAR_COLLAPSED = "w-[80px]";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItemType[]>([]);
  const { theme } = useTheme();
  const { data, isLoading } = useDetailAdmin();

  const sidebarExpanded = isExpanded || isHovered || isMobileOpen;

  const isActive = useCallback(
    (path: string) => {
      if (!path) return false;

      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname],
  );

  useEffect(() => {
    const fetchMenu = async () => {
      const currentRoleId = data?.data?.membershipRole?.id;

      if (!currentRoleId) return;

      try {
        const res = await fetch(`/api/menu/${currentRoleId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil menu");
        }

        const responseJson = await res.json();

        setNavItems(responseJson.data ?? []);
      } catch (error) {
        console.error("Error fetch menu:", error);
      }
    };

    fetchMenu();
  }, [data]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white text-gray-900 shadow-sm transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${sidebarExpanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => {
        if (!isExpanded) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!isExpanded) {
          setIsHovered(false);
        }
      }}
    >
      {/* Logo */}
      <div
        className={`flex h-20 shrink-0 items-center border-b border-gray-100 dark:border-gray-800 ${sidebarExpanded ? "px-5" : "justify-center"} `}
      >
        <Link
          href="/"
          className={`flex min-w-0 items-center ${sidebarExpanded ? "gap-3" : "justify-center"} `}
        >
          <Image
            src={
              theme === "dark"
                ? "/images/company/logo-dark.png"
                : "/images/company/logo.png"
            }
            alt="SKY Membership"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 object-contain"
            priority
          />

          {sidebarExpanded && (
            <span className="truncate text-lg font-semibold text-gray-900 dark:text-white">
              SKY Membership
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-5">
        <nav>
          <div
            className={`mb-3 flex h-6 items-center text-xs font-medium tracking-wider text-gray-400 uppercase ${sidebarExpanded ? "px-2" : "justify-center"} `}
          >
            {sidebarExpanded ? "Menu" : <HorizontaLDots />}
          </div>

          {isLoading && navItems.length === 0 ? (
            <SidebarSkeleton expanded={sidebarExpanded} />
          ) : (
            <ul className="space-y-1">
              {navItems.map((nav) => (
                <SidebarItem
                  key={nav.link ?? nav.name}
                  nav={nav}
                  isActive={isActive}
                  isExpanded={sidebarExpanded}
                />
              ))}
            </ul>
          )}
        </nav>
      </div>
    </aside>
  );
};

const SidebarSkeleton: React.FC<{
  expanded: boolean;
}> = ({ expanded }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`flex h-11 items-center rounded-lg bg-gray-100 dark:bg-gray-800 ${expanded ? "px-3" : "justify-center"} `}
        >
          <div className="h-5 w-5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

          {expanded && (
            <div className="ml-3 h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      ))}
    </div>
  );
};

const SidebarItem: React.FC<{
  nav: NavItemType;
  isActive: (path: string) => boolean;
  isExpanded: boolean;
}> = ({ nav, isActive, isExpanded }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLUListElement | null>(null);
  const [height, setHeight] = useState(0);

  const hasSubMenu = !!nav.subMenus && nav.subMenus.length > 0;

  const iconNode = nav.icon && iconMap[nav.icon] ? iconMap[nav.icon] : null;

  const hasActiveSubMenu =
    nav.subMenus?.some((sub) => isActive(sub.link)) ?? false;

  useEffect(() => {
    if (hasActiveSubMenu) {
      setOpen(true);
    }
  }, [hasActiveSubMenu]);

  useEffect(() => {
    if (!isExpanded) {
      setOpen(false);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (!open || !ref.current) {
      setHeight(0);
      return;
    }

    setHeight(ref.current.scrollHeight);
  }, [open, isExpanded, nav.subMenus]);

  if (hasSubMenu) {
    return (
      <li>
        <button
          type="button"
          onClick={() => {
            if (!isExpanded) return;
            setOpen((prev) => !prev);
          }}
          title={!isExpanded ? nav.name : undefined}
          className={`menu-item group w-full ${
            hasActiveSubMenu || open ? "menu-item-active" : "menu-item-inactive"
          } `}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">
            {iconNode}
          </span>

          {isExpanded && (
            <>
              <span className="ml-3 flex-1 truncate text-left">{nav.name}</span>

              <ChevronDownIcon
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} `}
              />
            </>
          )}
        </button>

        {isExpanded && (
          <div
            className="overflow-hidden transition-[height] duration-300 ease-in-out"
            style={{ height }}
          >
            <ul ref={ref} className="mt-1 space-y-1 pr-1 pl-8">
              {nav.subMenus?.map((sub) => (
                <li key={sub.link}>
                  <Link
                    href={sub.link}
                    className={`menu-dropdown-item ${
                      isActive(sub.link)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                    } `}
                  >
                    <span className="truncate">{sub.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  }

  const active = isActive(nav.link ?? "");

  return (
    <li>
      <Link
        href={nav.link || "#"}
        title={!isExpanded ? nav.name : undefined}
        className={`menu-item ${
          active ? "menu-item-active" : "menu-item-inactive"
        } `}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {iconNode}
        </span>

        {isExpanded && <span className="ml-3 truncate">{nav.name}</span>}
      </Link>
    </li>
  );
};

export default AppSidebar;
