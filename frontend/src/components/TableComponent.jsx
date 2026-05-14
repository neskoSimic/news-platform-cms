function TableComponent({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={column.header}
                  className="px-6 py-4 text-sm text-gray-600"
                >
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableComponent;
