import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import PostEditor from "../../../components/PostEditor";
import { updatePost } from "../../actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  const { data: authors } = await supabase
    .from("authors")
    .select("name")
    .order("name");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <PostEditor
          action={updatePost}
          initialData={{
            id: post.id,
            title: post.title,
            date: post.date,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            tags: post.tags || [],
            coverImage: post.cover_image,
            published: post.published,
          }}
          authors={authors || []}
          isEdit
        />
      </div>
    </div>
  );
}
