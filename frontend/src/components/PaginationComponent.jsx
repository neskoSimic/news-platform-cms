function PaginationComponent({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-center gap-2"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink-750 bg-ink-850 px-3 text-sm font-medium text-ink-200 transition-all duration-200 hover:border-amber-accent/40 hover:bg-ink-800 hover:text-amber-accent disabled:pointer-events-none disabled:opacity-40"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Prev
      </button>

      <div className="inline-flex h-9 items-center gap-2 rounded-lg border border-ink-750 bg-ink-900/60 px-4 font-mono text-sm tabular text-ink-100">
        <span className="font-semibold text-amber-accent">{currentPage}</span>
        <span className="text-ink-500">/</span>
        <span className="text-ink-300">{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink-750 bg-ink-850 px-3 text-sm font-medium text-ink-200 transition-all duration-200 hover:border-amber-accent/40 hover:bg-ink-800 hover:text-amber-accent disabled:pointer-events-none disabled:opacity-40"
      >
        Next
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}

export default PaginationComponent;
