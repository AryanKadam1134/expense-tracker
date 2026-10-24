import React from "react";

type PageHeaderProps = {
  heading?: string;
  subHeading?: string;
  className?: string;
  children?: React.ReactNode;
};

const PageHeader = ({
  heading,
  subHeading,
  className = "",
  children,
}: PageHeaderProps) => {
  return (
    <div
      className={`${className} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
    >
      <div>
        {heading && (
          <h1 className="text-2xl font-semibold tracking-tight text-light-text-primary dark:text-dark-text-primary sm:text-[28px]">
            {heading}
          </h1>
        )}

        {subHeading && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-light-text-secondary dark:text-dark-text-secondary">
            {subHeading}
          </p>
        )}
      </div>

      {children && (
        <div className="self-end sm:self-center h-full">{children}</div>
      )}
    </div>
  );
};

export default PageHeader;
