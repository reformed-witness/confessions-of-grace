import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { PostData, PostMetadata } from "@/types";

const postsDirectory = path.join(process.cwd(), "data/posts");

interface PostFrontmatter {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags?: string[];
  coverImage?: string;
}

function getPostIds(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

function readPostMetadata(id: string): PostMetadata {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;

  return {
    id,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    author: frontmatter.author,
    tags: frontmatter.tags || [],
    coverImage: frontmatter.coverImage || undefined,
  };
}

export async function getSortedPostsData(): Promise<PostMetadata[]> {
  const posts = getPostIds().map((id) => readPostMetadata(id));

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getAllPostIds(): Promise<{ params: { id: string } }[]> {
  return getPostIds().map((id) => ({
    params: { id },
  }));
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${id}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    id,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    content: contentHtml,
    author: frontmatter.author,
    tags: frontmatter.tags || [],
    coverImage: frontmatter.coverImage || undefined,
  };
}

export async function getPostsByTag(tag: string): Promise<PostMetadata[]> {
  const posts = await getSortedPostsData();
  return posts.filter((post) => post.tags.includes(tag));
}

export async function getPostsByAuthor(
  author: string,
): Promise<PostMetadata[]> {
  const posts = await getSortedPostsData();
  return posts.filter((post) => post.author === author);
}
