// src/utils/iconMap.tsx
import { LuLayoutDashboard } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { GoPeople } from "react-icons/go";
import { MdLocationCity, MdPayments, MdCardMembership } from "react-icons/md";
import { BiHistory, BiWalletAlt } from "react-icons/bi";
import { TbBrandOffice } from "react-icons/tb";
import { FaMoneyCheck } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { BoxCubeIcon, UserCircleIcon } from "@/icons"; // custom icon kamu

export const iconMap: Record<string, React.ReactNode> = {
  LuLayoutDashboard: <LuLayoutDashboard size={25} />,
  GoPeople: <GoPeople size={25} />,
  MdLocationCity: <MdLocationCity size={25} />,
  BoxCubeIcon: <BoxCubeIcon className="w-25" />,
  FaMoneyCheck: <FaMoneyCheck size={25} />,
  BiHistory: <BiHistory size={25} />,
  BiWalletAlt: <BiWalletAlt size={25} />,
  MdPayments: <MdPayments size={25} />,
  TbBrandOffice: <TbBrandOffice size={25} />,
  MdCardMembership: <MdCardMembership size={25} />,
  UserCircleIcon: <UserCircleIcon />,
  GrMoney: <GrMoney size={25} />,
  HiOutlineBuildingOffice2: <HiOutlineBuildingOffice2 size={25} />,
};
