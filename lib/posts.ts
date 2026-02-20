import { createClient } from "@/utils/supabase/server";
import { PostData, PostMetadata } from "@/types";

export async function getSortedPostsData(): Promise<PostMetadata[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, date, excerpt, author, tags, cover_image")
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return (data || []).map((post) => ({
    id: post.id,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    author: post.author,
    tags: post.tags || [],
    coverImage: post.cover_image || undefined,
  }));
}

export async function getAllPostIds(): Promise<{ params: { id: string } }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id")
    .eq("published", true);

  if (error) {
    console.error("Error fetching post IDs:", error);
    return [];
  }

  return (data || []).map((post) => ({
    params: { id: post.id },
  }));
}

export async function getPostData(id: string): Promise<PostData> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, date, excerpt, content_html, author, tags, cover_image")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(`Error fetching post ${id}:`, error);
    throw new Error(`Post not found: ${id}`);
  }

  return {
    id: data.id,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    content: data.content_html,
    author: data.author,
    tags: data.tags || [],
    coverImage: data.cover_image || undefined,
  };
}

export async function getPostsByTag(tag: string): Promise<PostMetadata[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, date, excerpt, author, tags, cover_image")
    .eq("published", true)
    .contains("tags", [tag])
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching posts by tag:", error);
    return [];
  }

  return (data || []).map((post) => ({
    id: post.id,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    author: post.author,
    tags: post.tags || [],
    coverImage: post.cover_image || undefined,
  }));
}

export async function getPostsByAuthor(
  author: string
): Promise<PostMetadata[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, date, excerpt, author, tags, cover_image")
    .eq("published", true)
    .eq("author", author)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching posts by author:", error);
    return [];
  }

  return (data || []).map((post) => ({
    id: post.id,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    author: post.author,
    tags: post.tags || [],
    coverImage: post.cover_image || undefined,
  }));
}
