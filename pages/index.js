import { getAllFilesFrontMatter } from "../lib/blog";
import Header from "../components/Header";
import SeoHead from "../components/SeoHead";
import Footer from "../components/Footer";
import ArticleListItem from "../components/ArticleListItem";

export default function Blog({ posts }) {
  return (
    <>
      <SeoHead />
      <Header main={true} />
      <main className="min-w-full">
        {posts.map((post) => (
          <ArticleListItem {...post} key={post.slug} />
        ))}
      </main>
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter("blog");

  return { props: { posts } };
}
