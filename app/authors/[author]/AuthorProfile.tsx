import React from 'react';
import { PostMetadata } from '@/types';

interface AuthorProfileProps {
    author: string;
    posts: PostMetadata[];
}

// Static author profile. No bio/social data is available in the markdown
// source, so we render the author's name and a placeholder avatar only.
export default function AuthorProfile({ author }: AuthorProfileProps) {
    return (
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Placeholder avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                {author.charAt(0).toUpperCase()}
            </div>

            <div>
                {/* Author Name */}
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {author}
                </h1>
            </div>
        </div>
    );
}
