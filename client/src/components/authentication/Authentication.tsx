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
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-10">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg border">
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
