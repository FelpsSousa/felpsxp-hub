'use client';

/** Opens the browser's print dialog, where the CV can also be saved as a PDF. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="w-fit rounded-md border border-border px-4 py-2 text-sm text-fg hover:border-accent focus-visible:outline-2 focus-visible:outline-accent print:hidden"
    >
      {label}
    </button>
  );
}
