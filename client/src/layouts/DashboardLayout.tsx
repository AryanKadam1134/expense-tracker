import { useState } from "react";

import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="h-full flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
