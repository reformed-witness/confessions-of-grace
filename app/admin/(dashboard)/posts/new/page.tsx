import { createClient } from "@/utils/supabase/server";
import PostEditor from "../../components/PostEditor";
import { createPost } from "../actions";

export default async function NewPostPage() {
  const supabase = await createClient();

  const { data: authors } = await supabase
    .from("authors")
    .select("name")
    .order("name");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">New Post</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <PostEditor action={createPost} authors={authors || []} />
      </div>
    </div>
  );
}
