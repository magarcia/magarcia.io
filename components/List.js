import React from "react";

export default function List({ ordered = false, ...props }) {
  if (ordered) return <ol className="list-decimal my-6" {...props} />;
  return <ul className="list-disc pl-4" {...props} />;
}
