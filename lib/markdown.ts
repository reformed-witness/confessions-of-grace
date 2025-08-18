
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { PostData, PostMetadata } from '@/types';

// Make sure this is only used on the server side
const postsDirectory = path.join(process.cwd(), 'data/posts');

export function getSortedPostsData(): PostMetadata[] {
    // Ensure we only run this on the server
    if (typeof window === 'undefined') {
        try {
            // Get file names under /posts
            const fileNames = fs.readdirSync(postsDirectory);
            const allPostsData = fileNames
                .filter(fileName => fileName.endsWith('.md')) // Only process .md files
                .map((fileName) => {
                    // Remove ".md" from file name to get id
                    const id = fileName.replace(/\.md$/, '');

                    // Skip if id is empty or undefined
                    if (!id || id === 'undefined') {
                        console.warn(`Skipping invalid filename: ${fileName}`);
                        return null;
                    }

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
                })
                .filter((post): post is PostMetadata => post !== null); // Filter out null values

            // Sort posts by date
            return allPostsData.sort((a, b) => {
                if (a.date < b.date) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } catch (error) {
            console.error('Error reading posts directory:', error);
            return [];
        }
    }

    // Return empty array if running on client side
    return [];
}

export function getAllPostIds() {
    // Ensure we only run this on the server
    if (typeof window === 'undefined') {
        try {
            const fileNames = fs.readdirSync(postsDirectory);

            return fileNames
                .filter(fileName => fileName.endsWith('.md'))
                .map((fileName) => {
                    const id = fileName.replace(/\.md$/, '');
                    if (!id || id === 'undefined') {
                        return null;
                    }
                    return {
                        params: {
                            id,
                        },
                    };
                })
                .filter((item): item is { params: { id: string } } => item !== null);
        } catch (error) {
            console.error('Error reading posts directory:', error);
            return [];
        }
    }

    // Return empty array if running on client side
    return [];
}

export async function getPostData(id: string): Promise<PostData> {
    // Ensure we only run this on the server
    if (typeof window === 'undefined') {
        try {
            // Validate id
            if (!id || id === 'undefined') {
                throw new Error(`Invalid post id: ${id}`);
            }

            const fullPath = path.join(postsDirectory, `${id}.md`);

            // Check if file exists
            if (!fs.existsSync(fullPath)) {
                throw new Error(`Post file not found: ${fullPath}`);
            }

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
        } catch (error) {
            console.error(`Error loading post ${id}:`, error);
            throw error;
        }
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

export function getPostsByAuthor(author: string): PostMetadata[] {
    const allPosts = getSortedPostsData();
    return allPosts.filter(post => post.author.includes(author));
}