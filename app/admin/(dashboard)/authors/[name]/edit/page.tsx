import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { updateAuthor } from "../../actions";

interface PageProps {
  params: Promise<{ name: string }>;
}

export default async function EditAuthorPage({ params }: PageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const supabase = await createClient();

  const { data: author, error } = await supabase
    .from("authors")
    .select("name, bio, x_link, fb_link, insta_link, pfp_link")
    .eq("name", decodedName)
    .single();

  if (error || !author) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Author</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <form action={updateAuthor} className="space-y-4">
          <input type="hidden" name="originalName" value={author.name} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={author.name}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={author.bio}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture URL
            </label>
            <input
              type="text"
              name="pfp_link"
              defaultValue={author.pfp_link || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              X (Twitter) Link
            </label>
            <input
              type="text"
              name="x_link"
              defaultValue={author.x_link || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook Link
            </label>
            <input
              type="text"
              name="fb_link"
              defaultValue={author.fb_link || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram Link
            </label>
            <input
              type="text"
              name="insta_link"
              defaultValue={author.insta_link || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-accent text-white px-6 py-2 rounded-md hover:bg-accent-dark"
            >
              Update Author
            </button>
            <a
              href="/admin/authors"
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
