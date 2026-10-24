import { Grid } from "antd";
const { useBreakpoint } = Grid;
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const screens = useBreakpoint();

  const maxPageButtons = screens.md ? 10 : screens.sm ? 5 : 3;

  if (!totalPages || totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const buttonBaseClasses =
    "flex size-9 items-center justify-center rounded-xl text-sm font-medium transition-colors";
  const inactiveButtonClasses = `${buttonBaseClasses} bg-light-bg-primary text-light-text-secondary shadow-sm ring-1 ring-light-border-primary hover:bg-light-bg-hover cursor-pointer`;
  const disabledButtonClasses = `${buttonBaseClasses} bg-light-bg-secondary text-light-text-tertiary opacity-50 cursor-not-allowed`;
  const activeButtonClasses = `${buttonBaseClasses} bg-[#174936] text-white shadow-sm`;
  const navButtonClasses = (isDisabled: boolean) =>
    isDisabled
      ? disabledButtonClasses
      : `${buttonBaseClasses} bg-light-bg-primary text-light-text-secondary shadow-sm ring-1 ring-light-border-primary hover:bg-light-bg-hover cursor-pointer`;

  return (
    <div className="flex flex-wrap justify-center gap-1.5 text-sm">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className={navButtonClasses(currentPage === 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={inactiveButtonClasses}
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-2 text-light-text-secondary dark:text-dark-text-secondary">
              ...
            </span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={
            currentPage === num ? activeButtonClasses : inactiveButtonClasses
          }
          title={`Go to page ${num}`}
        >
          {num}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-light-text-secondary dark:text-dark-text-secondary">
              ...
            </span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={inactiveButtonClasses}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className={navButtonClasses(currentPage === totalPages)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
