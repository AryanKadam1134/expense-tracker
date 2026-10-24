import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  ArrowUpRight,
  BellRing,
  ChevronRight,
  Landmark,
  Plus,
  Tags,
  WalletCards,
} from "lucide-react";

import { useAuth } from "../../context/auth/useAuth";

const shortcuts = [
  {
    title: "Accounts",
    description: "Review your balances and account details.",
    path: "/accounts",
    icon: WalletCards,
    tone: "bg-[#eaf3ec] text-[#24533d]",
  },
  {
    title: "Transactions",
    description: "Record and review money coming in and out.",
    path: "/transactions",
    icon: ArrowLeftRight,
    tone: "bg-[#edf1fa] text-[#4f6495]",
  },
  {
    title: "Transfers",
    description: "Track money moved between your accounts.",
    path: "/transfers",
    icon: ArrowUpRight,
    tone: "bg-[#f1effb] text-[#6452a1]",
  },
  {
    title: "Reminders",
    description: "Keep upcoming payments and dues visible.",
    path: "/reminders",
    icon: BellRing,
    tone: "bg-[#fff4df] text-[#9a6820]",
  },
  {
    title: "Banks",
    description: "Organize the banks behind your accounts.",
    path: "/banks",
    icon: Landmark,
    tone: "bg-[#e8f1f5] text-[#3c7187]",
  },
  {
    title: "Categories",
    description: "Make your transactions easier to understand.",
    path: "/categories",
    icon: Tags,
    tone: "bg-[#fcefed] text-[#a85d51]",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.firstName || user?.username || "there";

  return (
    <main className="flex flex-col gap-8">
      <section className="relative isolate overflow-hidden rounded-[28px] bg-[#173e2e] px-6 py-8 text-white shadow-[0_18px_55px_rgba(23,62,46,0.18)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
        <div className="absolute -right-20 -top-32 -z-10 size-[390px] rounded-full border border-white/10" />
        <div className="absolute -right-5 -top-20 -z-10 size-[270px] rounded-full border border-white/10" />
        <div className="absolute -bottom-36 right-28 -z-10 size-72 rounded-full bg-[#a9d5a7]/10 blur-3xl" />
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#d5e8d8]">
            <span className="size-1.5 rounded-full bg-[#a9d5a7]" /> Your finance
            workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[42px]">
            Good to see you, {firstName}.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#d4e1d7] sm:text-base">
            Keep your accounts, spending, and upcoming payments organized in one
            calm place.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/transactions/add"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d5edda] px-4 py-3 text-sm font-semibold text-[#173e2e] shadow-sm transition hover:bg-white"
            >
              <Plus size={17} /> Add a transaction
            </Link>
            <Link
              to="/accounts"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View accounts <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 right-10 hidden size-36 items-center justify-center rounded-[32px] border border-white/10 bg-white/5 text-[#cbe3d0] shadow-inner lg:flex">
          <WalletCards size={62} strokeWidth={1.2} />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6b8f76]">
              Manage your money
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-light-text-primary">
              Your finance toolkit
            </h2>
          </div>
          <p className="hidden text-sm text-light-text-tertiary sm:block">
            Choose where you want to start.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shortcuts.map(({ title, description, path, icon: Icon, tone }) => (
            <Link
              key={title}
              to={path}
              className="group flex min-h-36 items-start gap-4 rounded-2xl border border-light-border-primary bg-light-bg-primary p-5 shadow-[0_5px_20px_rgba(23,43,36,0.025)] transition-all duration-200 hover:-translate-y-1 hover:border-[#c6d9ca] hover:shadow-[0_14px_34px_rgba(23,43,36,0.08)]"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}
              >
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 font-semibold text-light-text-primary">
                  {title}
                  <ChevronRight
                    size={16}
                    className="text-light-text-tertiary transition group-hover:translate-x-1 group-hover:text-[#24533d]"
                  />
                </span>
                <span className="mt-1.5 block text-sm leading-5 text-light-text-secondary">
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-[#dfe9e1] bg-[#edf4ef] p-5 sm:grid-cols-3 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#567964]">
            Stay organized
          </p>
          <p className="mt-1 text-sm font-medium text-[#294b37]">
            Keep account details up to date.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#567964]">
            Understand activity
          </p>
          <p className="mt-1 text-sm font-medium text-[#294b37]">
            Use categories to make entries easier to scan.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#567964]">
            Plan ahead
          </p>
          <p className="mt-1 text-sm font-medium text-[#294b37]">
            Add reminders for payments you need to track.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
