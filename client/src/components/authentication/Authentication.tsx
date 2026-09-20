import React from "react";

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
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-10 bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="w-full max-w-md bg-light-bg-primary dark:bg-dark-bg-tertiary p-8 rounded-xl shadow-lg border border-light-border-primary dark:border-dark-border-primary">
        <PageHeader
          heading={heading}
          subHeading={subHeading}
          className="mb-8 justify-center text-center"
        />

        <form onSubmit={onSubmit} className="flex flex-col gap-4 text-sm">
          {formContent}
        </form>

        {formSubContent && (
          <div className="mt-4 flex flex-col gap-4 text-sm">
            {formSubContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Authentication;
