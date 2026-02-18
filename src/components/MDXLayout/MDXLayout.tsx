import { MDXProvider } from '@mdx-js/react';
import React, { Suspense } from 'react';
import { InlineTerminal, Terminal } from '@bebeal/rehype-code-terminal';

import 'katex/dist/katex.min.css';
import '@wooorm/starry-night/style/both';
import '@bebeal/rehype-code-terminal/style.css';

export interface Frontmatter {
  title?: string;
  date?: string;
  [key: string]: unknown;
}

export interface MDXModule {
  default: React.ComponentType;
  frontMatter?: Frontmatter;
}

interface MDXLayoutProps {
  children: React.ReactNode;
  components?: Record<string, React.ComponentType<unknown>>;
  frontMatter?: Frontmatter;
  showFrontMatter?: boolean;
}

const defaultComponents = {
  InlineTerminal,
  Terminal,
};

export const MDXLayout = ({ children, components = {}, frontMatter = {}, showFrontMatter = true }: MDXLayoutProps) => {
  const title = frontMatter.title as string | undefined;

  return (
    <section>
      <article className='w-full mx-auto prose prose-sm prose-zinc dark:prose-invert'>
        <Suspense fallback={<>Loading...</>}>
          {showFrontMatter && Object.keys(frontMatter).length > 0 && <FrontMatter frontMatter={frontMatter} />}
          {title && <h1 className='text-3xl font-bold text-center w-full'>{title}</h1>}
          <MDXProvider components={{ ...defaultComponents, ...components }}>{children}</MDXProvider>
        </Suspense>
      </article>
    </section>
  );
};

const FrontMatter = ({ frontMatter, showKeys = false }: { frontMatter: Frontmatter; showKeys?: boolean }) => {
  return (
    Object.keys(frontMatter).length > 0 && (
      <div className='flex flex-col h-auto py-4'>
        <div className='h-[1px] bg-gray-500 dark:bg-gray-400 max-w-[400px] mx-auto w-full' />
        <div className='max-w-[400px] mx-auto my-px py-2'>
          {Object.keys(frontMatter).map((key) => (
            <div key={key} className='text-xs text-gray-500 dark:text-gray-400 flex gap-1'>
              {showKeys && <span className='w-24 text-right'>{key}:</span>}
              <span>{frontMatter[key]?.toString() || ''}</span>
            </div>
          ))}
        </div>
        <div className='h-[1px] bg-gray-500 dark:bg-gray-400 max-w-[400px] mx-auto w-full' />
      </div>
    )
  );
};
