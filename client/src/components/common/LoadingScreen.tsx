import { LoaderCircle } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-light-bg-secondary text-light-text-primary dark:bg-dark-bg-tertiary dark:text-dark-text-primary">
      <div className="flex items-center gap-3 rounded-2xl border border-light-border-primary bg-light-bg-primary px-5 py-4 text-sm font-medium shadow-sm">
        <LoaderCircle size={18} className="animate-spin text-[#4f8a63]" />
        Restoring your session
      </div>
    </div>
  );
};

export default LoadingScreen;
