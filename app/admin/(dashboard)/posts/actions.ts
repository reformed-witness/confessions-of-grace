"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const tagsRaw = formData.get("tags") as string;
  const coverImage = (formData.get("coverImage") as string) || null;
  const published = formData.get("published") === "true";

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Render markdown to HTML
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  const { error } = await supabase.from("posts").insert({
    id,
    title,
    date: new Date(date).toISOString(),
    excerpt,
    content,
    content_html: contentHtml,
    author,
    tags,
    cover_image: coverImage,
    published,
  });

  if (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const tagsRaw = formData.get("tags") as string;
  const coverImage = (formData.get("coverImage") as string) || null;
  const published = formData.get("published") === "true";

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Render markdown to HTML
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      date: new Date(date).toISOString(),
      excerpt,
      content,
      content_html: contentHtml,
      author,
      tags,
      cover_image: coverImage,
      published,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
