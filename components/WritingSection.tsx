import type { FrontMatter } from "~/lib/blog";
import { getSectionTitle } from "~/lib/i18n";
import SectionHeader from "./SectionHeader";
import ArticleListItem from "./ArticleListItem";

interface WritingSectionProps {
  posts: FrontMatter[];
  lang: string;
}

export default function WritingSection({ posts, lang }: WritingSectionProps) {
  return (
    <section>
      <SectionHeader>{getSectionTitle("writing", lang)}</SectionHeader>
      {posts.map((post) => (
        <ArticleListItem {...post} key={post.slug} lang={lang} />
      ))}
    </section>
  );
}
