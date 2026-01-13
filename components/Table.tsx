import React, { useEffect, useRef } from "react";

export default function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const setDataLabels = () => {
      // Try to get headers from thead first (standard markdown table structure)
      // Use a more specific selector that works even when hidden
      let headers = Array.from(table.querySelectorAll("thead th")) as HTMLTableCellElement[];
      
      // If no thead headers, check first row of tbody for th elements
      // (some markdown parsers might put headers in tbody)
      if (headers.length === 0) {
        const firstRow = table.querySelector("tbody tr:first-child");
        if (firstRow) {
          headers = Array.from(firstRow.querySelectorAll("th")) as HTMLTableCellElement[];
        }
      }

      // If still no headers found, try querying all th elements in the table
      if (headers.length === 0) {
        headers = Array.from(table.querySelectorAll("th")) as HTMLTableCellElement[];
        // If we found headers but they're in tbody, use the first row's headers
        if (headers.length > 0) {
          const firstRowWithHeaders = headers[0]?.closest("tr");
          if (firstRowWithHeaders && firstRowWithHeaders.parentElement?.tagName === "TBODY") {
            headers = Array.from(firstRowWithHeaders.querySelectorAll("th")) as HTMLTableCellElement[];
          }
        }
      }

      // If still no headers found, skip
      if (headers.length === 0) {
        return;
      }

      // Get header text for each column (preserve indices - don't filter)
      const headerTexts = headers.map((th) => {
        return th.textContent?.trim() || th.innerText?.trim() || "";
      });

      // Skip if all headers are empty
      if (headerTexts.every((text) => !text)) {
        return;
      }

      // Apply data-label to each cell based on its column index
      // Only process rows that contain td elements (skip header rows)
      const rows = Array.from(table.querySelectorAll("tbody tr"));
      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td"));
        // Skip rows that don't have td elements (they might be header rows)
        if (cells.length === 0) return;
        
        cells.forEach((cell, index) => {
          if (index < headerTexts.length && headerTexts[index]) {
            cell.setAttribute("data-label", headerTexts[index]);
          }
        });
      });
    };

    // Use requestAnimationFrame for initial render
    const rafId = requestAnimationFrame(setDataLabels);

    // Use MutationObserver to handle dynamic content changes
    const observer = new MutationObserver(setDataLabels);
    observer.observe(table, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return <table ref={tableRef} className="block md:table table-fixed my-6 w-full" {...props} />;
}

export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className="block md:table-row border-b border-border last:border-b-0 mb-4 md:mb-0" {...props} />
  );
}

export function TableHead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className="sr-only md:not-sr-only md:table-header-group font-medium border-b border-border"
      {...props}
    />
  );
}

export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="block md:table-row-group" {...props} />;
}

export function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="block md:table-cell relative py-3 px-4 md:px-4 text-foreground" {...props} />
  );
}

export function TableHeaderCell(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className="block md:table-cell relative py-3 px-4 md:px-4 font-medium text-foreground" {...props} />
  );
}
