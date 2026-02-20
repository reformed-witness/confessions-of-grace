import { createAuthor } from "../actions";

export default function NewAuthorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">New Author</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <form action={createAuthor} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-accent text-white px-6 py-2 rounded-md hover:bg-accent-dark"
            >
              Create Author
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
