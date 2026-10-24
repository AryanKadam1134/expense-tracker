import { useEffect } from "react";

import { NavLink } from "react-router-dom";
import {
  SquareUserRound,
  LogOut,
  Settings,
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  BellRing,
  Landmark,
  Repeat2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import AppLogo from "./AppLogo";

import { useAuth } from "../../context/auth/useAuth";

type MenuItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

type NavItemProps = {
  menu: MenuItem;
  onClick: () => void;
};

type SideBarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const menus: MenuItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Banks", path: "/banks", icon: Landmark },
  { name: "Accounts", path: "/accounts", icon: SquareUserRound },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Transfers", path: "/transfers", icon: Repeat2 },
  { name: "Categories", path: "/categories", icon: Tags },
  { name: "Reminders", path: "/reminders", icon: BellRing },
];

const menuStyle =
  "group flex min-w-45 items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-all duration-200";

const NavItem = ({ menu, onClick }: NavItemProps) => {
  const Icon = menu.icon;

  return (
    <NavLink
      to={menu.path}
      onClick={onClick}
      className={({ isActive }) =>
        `${menuStyle}
        ${
          isActive
            ? "bg-[#eaf3ec] font-medium text-[#174936] shadow-sm"
            : "text-light-text-secondary hover:bg-light-bg-hover hover:text-light-text-primary"
        }
        `
      }
    >
      <Icon
        size={18}
        className="shrink-0 transition-transform group-hover:scale-105"
      />
      <p className="text-nowrap">{menu.name}</p>
    </NavLink>
  );
};

const SideBar = ({ isOpen, onClose }: SideBarProps) => {
  const { logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 z-50 h-full w-64
          bg-light-bg-primary
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col px-2.5
          border-r border-light-border-primary shadow-[8px_0_30px_rgba(24,55,39,0.03)]
        `}
      >
        {/* Header */}
        <div className="flex h-18 shrink-0 items-center border-b border-light-border-primary px-3">
          <div className="flex items-center gap-3">
            <AppLogo className="size-10" />

            <div>
              <p className="text-nowrap text-sm font-semibold tracking-tight text-light-text-primary">
                Expense Tracker
              </p>
              <p className="text-[11px] text-light-text-tertiary">
                Personal finance
              </p>
            </div>
          </div>
        </div>

        {/* Menus */}
        <div className="flex h-full flex-col justify-between gap-4 py-5">
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="mb-2 px-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-light-text-tertiary">
              Workspace
            </p>

            {menus.map((menu) => (
              <NavItem key={menu.name} menu={menu} onClick={onClose} />
            ))}
          </div>

          <div className="flex flex-col gap-1 border-t border-light-border-primary pt-4">
            <NavItem
              menu={{ name: "Settings", path: "/settings", icon: Settings }}
              onClick={onClose}
            />

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className={`${menuStyle} cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700`}
            >
              <LogOut size={18} />
              <p className="text-nowrap">Log out</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
