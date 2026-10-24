import { Menu } from "lucide-react";

import { useAuth } from "../../context/auth/useAuth";

import AppLogo from "./AppLogo";

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user } = useAuth();
  const displayName = user?.firstName || user?.username || "Your account";
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <header className="z-10 flex h-18 w-full shrink-0 items-center justify-between border-b border-light-border-primary bg-light-bg-primary/95 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-xl p-2.5 text-light-text-secondary transition hover:bg-light-bg-secondary md:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 sm:hidden">
          <AppLogo className="size-8 rounded-lg" />
          <p className="text-sm font-semibold tracking-tight text-light-text-primary">
            Expense Tracker
          </p>
        </div>

        <div className="hidden sm:block">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-light-text-tertiary">
            Personal finance workspace
          </p>
          <p className="text-sm font-medium text-light-text-primary">
            A clearer view of your money
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-xs text-light-text-tertiary">Welcome back</p>

          <p className="text-sm font-semibold text-light-text-primary">
            {displayName}
          </p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-full bg-[#e4f0e7] text-sm font-semibold text-[#24533d]">
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Header;
