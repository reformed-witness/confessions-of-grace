import { createClient } from "@/utils/supabase/server";
import { deleteComment } from "./actions";

export default async function AdminCommentsPage() {
  const supabase = await createClient();

  const { data: comments } = await supabase
    .from("comments")
    .select("id, name, email, comment, post_id, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Comments</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments?.map((comment) => (
              <tr key={comment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium">{comment.name}</p>
                  <p className="text-gray-500 text-sm">{comment.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-700 line-clamp-2 max-w-md">
                    {comment.comment}
                  </p>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {comment.post_id}
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {new Date(comment.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <form
                    action={deleteComment.bind(null, comment.id)}
                    className="inline"
                  >
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
        {(!comments || comments.length === 0) && (
          <p className="text-gray-500 text-center py-8">No comments found.</p>
        )}
      </div>
    </div>
  );
}
