import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { PostData, PostMetadata } from '@/types';

// Make sure this is only used on the server side
const postsDirectory = path.join(process.cwd(), 'src/posts');

export function getSortedPostsData(): PostMetadata[] {
  // Ensure we only run this on the server
  if (typeof window === 'undefined') {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        title: matterResult.data.title || '',
        date: matterResult.data.date || '',
        excerpt: matterResult.data.excerpt || '',
        author: matterResult.data.author || '',
        tags: matterResult.data.tags || [],
        coverImage: matterResult.data.coverImage || undefined,
      } as PostMetadata;
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  
  // Return empty array if running on client side
  return [];
}

export function getAllPostIds() {
  // Ensure we only run this on the server
  if (typeof window === 'undefined') {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
  }
  
  // Return empty array if running on client side
  return [];
}

export async function getPostData(id: string): Promise<PostData> {
  // Ensure we only run this on the server
  if (typeof window === 'undefined') {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
      id,
      content: contentHtml,
      title: matterResult.data.title || '',
      date: matterResult.data.date || '',
      excerpt: matterResult.data.excerpt || '',
      author: matterResult.data.author || '',
      tags: matterResult.data.tags || [],
      coverImage: matterResult.data.coverImage || undefined,
    };
  }
  
  // Return empty object if running on client side (should never happen in practice)
  return {
    id: '',
    content: '',
    title: '',
    date: '',
    excerpt: '',
    author: '',
    tags: [],
  };
}

export function getPostsByTag(tag: string): PostMetadata[] {
  const allPosts = getSortedPostsData();
  return allPosts.filter(post => post.tags.includes(tag));
}