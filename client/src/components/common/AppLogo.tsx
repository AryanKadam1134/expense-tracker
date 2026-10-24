import { WalletCards } from "lucide-react";

const AppLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`${className} flex items-center justify-center rounded-xl bg-[#174936] text-white shadow-sm`}
    >
      <WalletCards size={19} strokeWidth={2.2} aria-hidden="true" />
    </div>
  );
};

export default AppLogo;
