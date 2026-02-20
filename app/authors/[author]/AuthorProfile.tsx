'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
import { PostMetadata } from '@/types';

interface AuthorProfile {
    name: string;
    bio: string;
    x_link?: string;
    fb_link?: string;
    insta_link?: string;
    pfp_link?: string;
}

interface AuthorProfileProps {
    author: string;
    posts: PostMetadata[];
}

export default function AuthorProfile({ author, posts }: AuthorProfileProps) {
    const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);

    const fetchAuthorProfile = async () => {
        const { data, error } = await supabase
            .from('authors')
            .select('name, bio, x_link, fb_link, insta_link, pfp_link')
            .eq('name', author)
            .single();

        if (error) {
            console.warn('No author profile found for:', author, '→', error.message);
        }

        if (data) {
            setAuthorProfile(data);
        }
    };

    useEffect(() => {
        fetchAuthorProfile();
    }, [author]);

    return (
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            {authorProfile?.pfp_link ? (
                <img
                    src={authorProfile.pfp_link}
                    alt={`${authorProfile.name}'s profile picture`}
                    className="w-24 h-24 rounded-full object-cover shadow-md"
                />
            ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                    ?
                </div>
            )}

            <div>
                {/* Author Name */}
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {authorProfile?.name || author}
                </h1>

                {/* Author Bio */}
                {authorProfile?.bio && (
                    <p className="text-primary-600 mb-2">{authorProfile.bio}</p>
                )}

                {/* Social Links */}
                <div className="flex gap-4 mt-2">
                    {authorProfile?.x_link && (
                        <a
                            href={authorProfile.x_link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src="/icons/x.svg" alt="X (Twitter)" className="w-5 h-5" />
                        </a>
                    )}
                    {authorProfile?.fb_link && (
                        <a
                            href={authorProfile.fb_link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
                        </a>
                    )}
                    {authorProfile?.insta_link && (
                        <a
                            href={authorProfile.insta_link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src="/icons/instagram.svg" alt="Instagram" className="w-5 h-5" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}