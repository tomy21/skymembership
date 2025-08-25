"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
} from "../icons/index";
import { GoPeople } from "react-icons/go";
import { MdCardMembership, MdLocationCity, MdPayments } from "react-icons/md";
import { BiHistory, BiWalletAlt } from "react-icons/bi";
import { TbBrandOffice } from "react-icons/tb";
import { FaMoneyCheck } from "react-icons/fa";
// import { TbBrandOffice } from "react-icons/tb";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: <GoPeople size={24} />,
    name: "Membership",
    path: "/admin/list-membership",
  },
  {
    icon: <MdLocationCity size={25} />,
    name: "Location",
    path: "/admin/location",
  },
  {
    icon: <BoxCubeIcon size={25} />,
    name: "Product",
    path: "/admin/product",
  },
  {
    icon: <FaMoneyCheck size={25} />,
    name: "Reconsiliasi",
    subItems: [
      { name: "Bayarind", path: "/admin/reconsiliasi/bayarind", pro: false },
      { name: "Nobu", path: "/admin/reconsiliasi/nobu", pro: false },
    ],
  },
  {
    name: "History",
    icon: <BiHistory size={25} />,
    subItems: [
      { name: "Transactions", path: "/admin/history/transaction", pro: false },
      { name: "Parkings", path: "/admin/history/parking", pro: false },
      { name: "Points", path: "/admin/history/point", pro: false },
    ],
  },
  {
    name: "Transaction",
    icon: <BiWalletAlt size={25} />,
    subItems: [
      { name: "Purchase", path: "/admin/purchase", pro: false },
      { name: "Topup", path: "/admin/topup", pro: false },
    ],
  },
  {
    icon: <MdPayments size={25} />,
    name: "Payment Management",
    path: "/admin/payment-management",
  },
  {
    icon: <TbBrandOffice size={25} />,
    name: "Tenant Management",
    path: "/admin/tenant",
  },
  {
    icon: <MdCardMembership size={25} />,
    name: "Card Management",
    path: "/admin/master-card",
  },
  {
    name: "User Management",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "User", path: "/admin/user-management/users", pro: false },
      {
        name: "Customers",
        path: "/admin/user-management/customer",
        pro: false,
      },
      { name: "Role", path: "/admin/user-management/role", pro: false },
      // {
      //   name: "Role Permission",
      //   path: "/admin/user-management/role-permission",
      //   pro: false,
      // },
      { name: "Menu", path: "/admin/user-management/menu", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (navItems: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "text-brand-500 rotate-180"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 ml-9 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="ml-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback(
    (path: string) => {
      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname],
  );

  useEffect(() => {
    // Auto open submenu if current path matches any of its children
    navItems.forEach((item, index) => {
      if (item.subItems) {
        const match = item.subItems.some((sub) => isActive(sub.path));
        if (match) {
          setOpenSubmenu({ type: "main", index });
        }
      }
    });
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex items-end justify-end space-x-2">
                <Image
                  className="dark:hidden"
                  src="/images/company/logo.png"
                  alt="Logo"
                  width={50}
                  height={40}
                />
                <p className="text-theme-lg text-start font-medium text-gray-500 dark:hidden dark:text-gray-400">
                  SKY Membership
                </p>
                <Image
                  className="hidden dark:block"
                  src="/images/company/logo-dark.png"
                  alt="Logo"
                  width={50}
                  height={40}
                />
                <p className="text-theme-lg hidden text-start font-medium text-gray-500 dark:block dark:text-gray-400">
                  SKY Membership
                </p>
              </div>
            </>
          ) : (
            <Image
              src="/images/company/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
