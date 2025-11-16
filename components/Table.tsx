export default function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className="block md:table table-fixed" {...props} />;
}

export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className="block md:table-row border-b last:border-b-0" {...props} />
  );
}

export function TableHead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className="hidden md:table-header-group font-bold border-b last:border-b-0"
      {...props}
    />
  );
}

export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="block md:table-cell relative py-2 md:px-2" {...props} />
  );
}
