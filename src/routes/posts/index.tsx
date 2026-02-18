// posts.index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Frontmatter, MDXModule } from '@/components/MDXLayout';

// posts are .mdx files in the src/routes/posts directory, some have optional frontmatter
interface Post extends Frontmatter {
  id: string;
}

const postFiles = import.meta.glob<MDXModule>('./*.{md,mdx}', { eager: true });
// Filter duplicate .md files when .mdx exists
const posts = Object.fromEntries(Object.entries(postFiles).filter(([path]) => !path.endsWith('.md') || !(path.replace('.md', '.mdx') in postFiles)));

export const Route = createFileRoute('/posts/')({
  loader: async () => {
    // Extract post data with proper fallbacks
    const postList = Object.entries(posts)
      .map(([path, module]): Post | null => {
        const id = path.match(/\.\/(.+)\.(md|mdx)/)?.[1];
        if (!id) return null;

        return {
          id,
          title: module.frontMatter?.title || id,
          date: module.frontMatter?.date,
        };
      })
      .filter((post): post is Post => post !== null);

    // Sort posts by date (newest first), then by title, then by id
    return {
      posts: postList.sort((a, b) => {
        if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (a.date) return -1;
        if (b.date) return 1;
        if (a.title && !b.title) return -1;
        if (!a.title && b.title) return 1;
        return a.title && b.title ? a.title.localeCompare(b.title) : a.id.localeCompare(b.id);
      }),
    };
  },
  component: PostsIndexComponent,
});

function PostsIndexComponent() {
  const { posts } = Route.useLoaderData();

  return (
    <div className='max-w-4xl mx-auto py-8 dark:text-white text-black'>
      <h1 className='text-2xl mb-8'>Posts</h1>
      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <ul className='bg-gray-100 dark:bg-[#1a1a1a] rounded-md border border-gray-400 dark:border-gray-600 max-h-[600px] overflow-y-auto'>
          {posts.map((post: Post) => (
            <li key={post.id} className='border-b border-gray-400 dark:border-gray-600 last:border-b-0'>
              <Link to='/posts/$postId' params={{ postId: post.id }} className='flex justify-between items-center gap-8 p-4 min-w-[500px] dark:text-white text-black'>
                <span>{post.title}</span>
                {post.date && <span className='text-sm dark:text-gray-200 whitespace-nowrap'>{post.date}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
