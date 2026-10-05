import { useEffect } from "react";

import { NavLink } from "react-router-dom";
import {
  SquareUserRound,
  LogOut,
  Settings,
  LayoutDashboard,
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
  { name: "Accounts", path: "/accounts", icon: SquareUserRound },
];

const menuStyle =
  "px-3 py-2.5 flex items-center gap-2.5 text-sm min-w-45 rounded-md transition-all duration-200";

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
            ? "bg-light-bg-hover text-light-text-primary font-medium"
            : "text-light-text-secondary hover:bg-light-bg-hover hover:text-light-text-primary"
        }
        `
      }
    >
      <Icon size={17} />
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
          border-r border-light-border-primary
        `}
      >
        {/* Header */}
        <div className="shrink-0 h-16 flex items-center border-b border-light-border-primary">
          <div className="flex items-center gap-2.5">
            <AppLogo className="ml-3 size-9" />

            <p className="text-nowrap text-md font-medium text-light-text-primary">
              Profilo
            </p>
          </div>
        </div>

        {/* Menus */}
        <div className="py-3 flex flex-col gap-2 justify-between h-full">
          <div className="flex-1 flex flex-col gap-1.5">
            {menus.map((menu) => (
              <NavItem key={menu.name} menu={menu} onClick={onClose} />
            ))}
          </div>

          <NavItem
            menu={{ name: "Settings", path: "/settings", icon: Settings }}
            onClick={onClose}
          />

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className={`
              ${menuStyle}
              text-red-600 hover:text-red-700 hover:bg-red-50
              cursor-pointer
            `}
          >
            <LogOut size={17} />
            <p className="text-nowrap">Logout</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
