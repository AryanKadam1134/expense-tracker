import React from "react";

import AppLogo from "../common/AppLogo";
import PageHeader from "../common/PageHeader";

type AuthenticationProps = {
  heading?: string;
  subHeading?: string;
  onSubmit: () => void;
  formContent: React.ReactNode;
  formSubContent: React.ReactNode;
};

const Authentication = ({
  heading,
  subHeading,
  onSubmit,
  formContent,
  formSubContent,
}: AuthenticationProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3f7f4] px-4 py-8 sm:px-8">
      <div className="absolute -left-28 -top-28 size-80 rounded-full bg-[#dcece0] blur-3xl" />

      <div className="absolute -bottom-40 -right-16 size-96 rounded-full bg-[#e4ece2] blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_28px_90px_rgba(24,55,39,0.13)] md:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#173e2e] p-10 text-white md:flex lg:p-12">
          <div className="absolute -right-24 top-16 size-72 rounded-full border border-white/10" />

          <div className="absolute -right-8 top-32 size-40 rounded-full border border-white/10" />

          <div className="relative flex items-center gap-3">
            <AppLogo className="size-11 bg-white/15 text-white shadow-none" />

            <div>
              <p className="font-semibold tracking-tight">Expense Tracker</p>
              <p className="text-xs text-white/60">Personal finance</p>
            </div>
          </div>

          <div className="relative my-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b7d4be]">
              A little more clarity
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
              Make room for better money habits.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              Keep your accounts and everyday financial activity together, so it
              is easier to know where things stand.
            </p>
          </div>

          <div className="relative flex items-center gap-2 text-xs text-white/60">
            <span className="size-2 rounded-full bg-[#a9d5a7]" /> A clear place
            for your finances
          </div>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-7 flex items-center gap-3 md:hidden">
            <AppLogo className="size-10" />

            <div>
              <p className="text-sm font-semibold text-light-text-primary">
                Expense Tracker
              </p>

              <p className="text-xs text-light-text-tertiary">
                Personal finance
              </p>
            </div>
          </div>

          <PageHeader
            heading={heading}
            subHeading={subHeading}
            className="mb-8"
          />

          <form onSubmit={onSubmit} className="flex flex-col gap-5 text-sm">
            {formContent}
          </form>

          {formSubContent && (
            <div className="mt-6 flex flex-col gap-5 text-sm">
              {formSubContent}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Authentication;
