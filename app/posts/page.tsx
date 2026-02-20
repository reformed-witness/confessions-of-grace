export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { getSortedPostsData } from '@/lib/posts';
import { PostMetadata } from '@/types';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        title: 'Posts Archive',
        description: 'Browse all posts from Confessions of Grace, organized by year.',
        url: 'https://confessionsofgrace.com/posts',
        type: 'website'
    });
}

async function getPostsAndYears(): Promise<{ posts: PostMetadata[]; years: number[] }> {
    const posts = await getSortedPostsData();

    // Extract unique years from post dates
    const years = Array.from(new Set(
        posts.map(post => new Date(post.date).getFullYear())
    )).sort((a, b) => b - a); // Sort years in descending order

    return { posts, years };
}

export default async function PostsPage() {
    const { posts, years } = await getPostsAndYears();

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Archive</h1>

            {years.map(year => (
                <div key={year} className="mb-12">
                    <h2 className="text-2xl font-bold border-b border-primary-200 pb-2 mb-6">{year}</h2>
                    <ul className="space-y-6">
                        {posts
                            .filter(post => new Date(post.date).getFullYear() === year)
                            .map(post => (
                                <li key={post.id} className="bg-white p-6 rounded-md shadow-sm border border-primary-200">
                                    <div className="md:flex md:justify-between md:items-center">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">
                                                <Link href={`/posts/${post.id}`} className="hover:text-accent-dark">
                                                    {post.title}
                                                </Link>
                                            </h3>
                                            <div className="flex items-center mb-2 text-sm text-primary-500">
                                                <span>{post.author}</span>
                                                <span className="mx-2">•</span>
                                                <time dateTime={post.date}>
                                                    {format(new Date(post.date), 'MMMM d, yyyy')}
                                                </time>
                                            </div>
                                            <p className="text-primary-600">{post.excerpt}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4 items-center">
                                        {post.tags.map(tag => (
                                            <Link
                                                key={tag}
                                                href={`/tags/${tag}`}
                                                className="text-sm bg-primary-100 text-primary-600 px-3 py-1 rounded-md hover:bg-primary-200"
                                            >
                                                {tag}
                                            </Link>
                                        ))}
                                        <div className="mt-4 md:mt-0 md:self-end md:ml-auto flex justify-end">
                                            <Link href={`/posts/${post.id}`} className="text-sm bg-accent text-white px-3 py-1 rounded-md hover:bg-accent-dark">
                                                Read post
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}