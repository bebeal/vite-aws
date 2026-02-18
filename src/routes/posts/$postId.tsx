import { createFileRoute } from '@tanstack/react-router';
import { MDXLayout, MDXModule } from '@/components/MDXLayout';

const posts = import.meta.glob<MDXModule>('./*.{md,mdx}', { eager: true });

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const { postId } = params;
    // preference to mdx over md if both exist for some reason (you should not allow for both to exist ever)
    const module = posts[`./${postId}.mdx`] || posts[`./${postId}.md`];
    if (!module) {
      throw new Error(`Post not found: ${postId}`);
    }

    return {
      module,
      frontMatter: module.frontMatter || {},
    };
  },
  component: PostComponent,
});

function PostComponent() {
  const { module, frontMatter } = Route.useLoaderData();
  const Content = module.default;

  return (
    <MDXLayout frontMatter={frontMatter} showFrontMatter={true}>
      <Content />
    </MDXLayout>
  );
}
