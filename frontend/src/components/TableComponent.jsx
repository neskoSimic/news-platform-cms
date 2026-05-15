function TableComponent({ columns, data }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-750 bg-ink-850/60 shadow-elev-2">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-ink-750 bg-ink-900/60">
              {columns.map((column) => (
                <th
                  key={column.header}
                  className="whitespace-nowrap px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-300"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-ink-400"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-ink-750 bg-ink-900 text-ink-500">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 6h18M3 12h18M3 18h18" />
                      </svg>
                    </div>
                    <p className="font-display text-base text-ink-200">
                      No records found
                    </p>
                    <p className="text-xs text-ink-500">
                      There is nothing to display here yet.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {data.map((item, idx) => (
              <tr
                key={item.id}
                className={`group border-b border-ink-750/60 transition-colors duration-150 hover:bg-ink-800/60 ${
                  idx === data.length - 1 ? "border-b-0" : ""
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className="px-6 py-4 align-middle text-sm text-ink-100"
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableComponent;
