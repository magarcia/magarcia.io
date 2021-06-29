import React from "react";

function Table(props) {
  return <table className="block md:table table-fixed" {...props} />;
}

Table.Row = function Row(props) {
  return (
    <tr className="block md:table-row border-b last:border-b-0" {...props} />
  );
};

Table.Head = function Head(props) {
  return (
    <thead
      className="hidden md:table-header-group font-bold border-b last:border-b-0"
      {...props}
    />
  );
};

Table.Body = function Body(props) {
  return <tbody {...props} />;
};

Table.Cell = function Cell(props) {
  return (
    <td className="block md:table-cell relative py-2 md:px-2" {...props} />
  );
};

export default Table;
