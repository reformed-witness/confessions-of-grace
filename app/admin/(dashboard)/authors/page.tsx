import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { deleteAuthor } from "./actions";

export default async function AdminAuthorsPage() {
  const supabase = await createClient();

  const { data: authors } = await supabase
    .from("authors")
    .select("name, bio, x_link, fb_link, insta_link, pfp_link")
    .order("name");

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Authors</h1>
        <Link
          href="/admin/authors/new"
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark"
        >
          New Author
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Links
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {authors?.map((author) => (
              <tr key={author.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{author.name}</td>
                <td className="px-6 py-4">
                  <p className="text-gray-600 line-clamp-2 max-w-md">
                    {author.bio}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {author.x_link && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        X
                      </span>
                    )}
                    {author.fb_link && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        FB
                      </span>
                    )}
                    {author.insta_link && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        IG
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/authors/${encodeURIComponent(author.name)}/edit`}
                    className="text-sm text-accent hover:text-accent-dark"
                  >
                    Edit
                  </Link>
                  <form
                    action={deleteAuthor.bind(null, author.name)}
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
        {(!authors || authors.length === 0) && (
          <p className="text-gray-500 text-center py-8">No authors found.</p>
        )}
      </div>
    </div>
  );
}
