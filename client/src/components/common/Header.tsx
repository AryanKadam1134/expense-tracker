import { Menu } from "lucide-react";

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <div className="shrink-0 h-16 w-full px-5 sm:hidden flex items-center justify-between bg-light-bg-primary border-b border-light-border-primary text-light-text-primary shadow-sm z-10">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-md hover:bg-light-bg-secondary transition"
      >
        <Menu size={22} />
      </button>
    </div>
  );
};

export default Header;
