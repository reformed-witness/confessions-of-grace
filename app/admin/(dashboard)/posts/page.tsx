import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { deletePost } from "./actions";

export default async function AdminPostsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, date, author, published, tags")
    .order("date", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark"
        >
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts?.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-gray-900 font-medium hover:text-accent-dark"
                  >
                    {post.title}
                  </Link>
                  <p className="text-gray-500 text-sm">{post.id}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{post.author}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(post.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {post.published ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Published
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-sm text-accent hover:text-accent-dark"
                  >
                    Edit
                  </Link>
                  <form action={deletePost.bind(null, post.id)} className="inline">
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!posts || posts.length === 0) && (
          <p className="text-gray-500 text-center py-8">No posts found.</p>
        )}
      </div>
    </div>
  );
}
