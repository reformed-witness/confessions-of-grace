export const dynamic = "force-dynamic";

import ShareButtons from "@/components/ShareButtons";
import { getPostData, getSortedPostsData } from "@/lib/posts";
import { PostData, PostMetadata } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CommentSection from "@/components/CommentSection";
import { generateMetadata as createMetadata } from "@/components/Metadata";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostData(id);
  const postUrl = `https://confessionsofgrace.com/posts/${post.id}`;

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    image: post.coverImage,
    url: postUrl,
    type: "article",
  });
}

async function getPostAndMorePosts(
  id: string,
): Promise<{ post: PostData; morePosts: PostMetadata[] }> {
  const post = await getPostData(id);
  const allPosts = await getSortedPostsData();

  // Filter out the current post and get a few related posts (by tags)
  const otherPosts = allPosts.filter((p) => p.id !== post.id);

  // Find posts with matching tags
  const relatedPosts = otherPosts
    .filter((p) => p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 2);

  // If we don't have enough related posts, add recent posts
  const morePosts =
    relatedPosts.length < 2
      ? [
          ...relatedPosts,
          ...otherPosts.filter((p) => !relatedPosts.includes(p)),
        ].slice(0, 2)
      : relatedPosts;

  return { post, morePosts };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const { post, morePosts } = await getPostAndMorePosts(id);
  const postUrl = `https://confessionsofgrace.com/posts/${post.id}`;

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>
        <div className="flex items-center text-primary-500 mb-6">
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.date}>
            {format(new Date(post.date), "MMMM d, yyyy")}
          </time>
        </div>
        {post.coverImage && (
          <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="text-sm bg-primary-100 text-primary-600 px-3 py-1 rounded-md hover:bg-primary-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      </header>

      <div
        className="blog-post prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-8 pt-6 border-t border-primary-200">
        <ShareButtons
          url={postUrl}
          title={post.title}
          description={post.excerpt}
        />
      </div>

      <div className="mt-12 pt-6 border-t border-primary-200">
        <h2 className="text-2xl font-bold mb-6">More Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {morePosts.slice(0, 2).map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-md border border-primary-200 shadow-sm"
            >
              <h3 className="font-bold mb-2">
                <Link
                  href={`/posts/${post.id}`}
                  className="hover:text-accent-dark"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="text-primary-600 text-sm mb-2">
                {format(new Date(post.date), "MMMM d, yyyy")}
              </p>
              <p className="text-primary-700">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </div>

      <CommentSection postId={post.id} />

      <div className="mt-12 pt-6 border-t border-primary-200">
        <Link
          href="/public"
          className="text-accent-dark hover:text-accent inline-flex items-center"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to all posts
        </Link>
      </div>
    </article>
  );
}
