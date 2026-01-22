export default function Paragraph(
  props: React.HTMLAttributes<HTMLParagraphElement>,
) {
  return <p className="leading-relaxed text-foreground" {...props} />;
}
