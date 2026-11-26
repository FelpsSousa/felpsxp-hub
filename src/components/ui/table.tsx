import type { ReactNode } from 'react';

/**
 * A plain table in the visual standard (ADR-0012): head on the surface fill,
 * rows divided by the border colour. The caption is for assistive technology;
 * the visible title sits above the table. `numericColumn` keeps one column on
 * a single line with tabular figures.
 */
export function DataTable({
  caption,
  head,
  rows,
  numericColumn,
}: {
  caption: string;
  head: string[];
  rows: ReactNode[][];
  numericColumn?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface text-fg">
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col" className="px-3 py-2 font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-fg">
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-3 py-2 align-top ${
                    cellIndex === numericColumn ? 'whitespace-nowrap tabular-nums' : ''
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
