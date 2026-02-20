export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { generateMetadata as createMetadata } from '@/components/Metadata';
import type { Metadata } from 'next';

interface AuthorProfile {
    name: string;
    bio: string;
    x_link?: string;
    fb_link?: string;
    insta_link?: string;
    pfp_link?: string;
}

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        title: 'Authors',
        description: 'Meet the authors of Confessions of Grace and learn about their backgrounds in Reformed theology.',
        url: 'https://confessionsofgrace.com/authors',
        type: 'website'
    });
}

async function getAuthors(): Promise<AuthorProfile[]> {
    try {
        const supabase = await createClient();
        const { data: authorsData, error } = await supabase
            .from('authors')
            .select('name, bio, x_link, fb_link, insta_link, pfp_link');

        if (error || !authorsData) {
            console.error('Error fetching authors:', error);
            return [];
        }

        return authorsData;
    } catch (error) {
        console.error('Failed to fetch authors during build:', error);
        return [];
    }
}

export default async function AuthorsPage() {
    const authors = await getAuthors();

    return (
        <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-10 text-center">Meet the Authors</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {authors.map((author) => (
                    <Link
                        key={author.name}
                        href={`/authors/${author.name}`}
                        className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center hover:shadow-lg transition-shadow"
                    >
                        <div className="w-24 h-24 mb-4 relative">
                            <Image
                                src={author.pfp_link || '/images/authors/default.jpg'}
                                alt={`${author.name}'s profile`}
                                fill
                                className="rounded-full object-cover"
                                sizes="96px"
                            />
                        </div>
                        <h2 className="text-lg font-semibold">{author.name}</h2>
                        {/* You can include bio or social icons here */}
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