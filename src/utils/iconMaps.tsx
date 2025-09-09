// src/utils/iconMap.tsx
import { LuLayoutDashboard } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { MdLocationCity, MdPayments, MdCardMembership } from "react-icons/md";
import { BiHistory, BiWalletAlt } from "react-icons/bi";
import { TbBrandOffice } from "react-icons/tb";
import { FaMoneyCheck } from "react-icons/fa";
import { BoxCubeIcon, UserCircleIcon } from "@/icons"; // custom icon kamu

export const iconMap: Record<string, React.ReactNode> = {
  LuLayoutDashboard: <LuLayoutDashboard size={25} />,
  GoPeople: <GoPeople size={25} />,
  MdLocationCity: <MdLocationCity size={25} />,
  BoxCubeIcon: <BoxCubeIcon size={25} />,
  FaMoneyCheck: <FaMoneyCheck size={25} />,
  BiHistory: <BiHistory size={25} />,
  BiWalletAlt: <BiWalletAlt size={25} />,
  MdPayments: <MdPayments size={25} />,
  TbBrandOffice: <TbBrandOffice size={25} />,
  MdCardMembership: <MdCardMembership size={25} />,
  UserCircleIcon: <UserCircleIcon />,
};
