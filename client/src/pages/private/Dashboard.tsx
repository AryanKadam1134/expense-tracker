import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="p-6 flex flex-col gap-1">
      <span>User Dashboard</span>

      <button
        onClick={logout}
        className="w-fit px-3 py-1 text-white text-sm bg-red-400 hover:bg-red-500 rounded-md transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
