import React from 'react';
import Link from 'next/link';
import { getAllAuthors } from '@/lib/authors';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        title: 'Authors',
        description: 'Meet the authors of Confessions of Grace and learn about their backgrounds in Reformed theology.',
        url: 'https://confessionsofgrace.com/authors',
        type: 'website'
    });
}

export default async function AuthorsPage() {
    const authors = await getAllAuthors();

    return (
        <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-10 text-center">Meet the Authors</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {authors.map((author) => (
                    <Link
                        key={author.name}
                        href={`/authors/${encodeURIComponent(author.slug)}`}
                        className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center hover:shadow-lg transition-shadow"
                    >
                        <div className="w-24 h-24 mb-4 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                            {author.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-lg font-semibold">{author.name}</h2>
                        <p className="text-sm text-primary-500 mt-1">
                            {author.postCount} {author.postCount === 1 ? 'post' : 'posts'}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link href="/posts" className="button">
                    View All Posts
                </Link>
            </div>
        </div>
    );
}
