import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [postsRes, commentsRes, subsRes, authorsRes] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }),
    supabase.from("authors").select("name", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Posts", count: postsRes.count || 0, href: "/admin/posts" },
    {
      label: "Comments",
      count: commentsRes.count || 0,
      href: "/admin/comments",
    },
    {
      label: "Subscribers",
      count: subsRes.count || 0,
      href: "/admin/subscriptions",
    },
    { label: "Authors", count: authorsRes.count || 0, href: "/admin/authors" },
  ];

  // Recent posts
  const { data: recentPosts } = await supabase
    .from("posts")
    .select("id, title, date, published")
    .order("created_at", { ascending: false })
    .limit(5);

  // Recent comments
  const { data: recentComments } = await supabase
    .from("comments")
    .select("id, name, comment, post_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.count}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Posts</h2>
            <Link
              href="/admin/posts/new"
              className="text-sm bg-accent text-white px-3 py-1 rounded-md hover:bg-accent-dark"
            >
              New Post
            </Link>
          </div>
          {recentPosts && recentPosts.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {recentPosts.map((post) => (
                <li key={post.id} className="py-3">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="hover:text-accent-dark"
                  >
                    <span className="font-medium">{post.title}</span>
                    {!post.published && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </Link>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No posts yet.</p>
          )}
        </div>

        {/* Recent Comments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Comments</h2>
            <Link
              href="/admin/comments"
              className="text-sm text-accent hover:text-accent-dark"
            >
              View All
            </Link>
          </div>
          {recentComments && recentComments.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {recentComments.map((comment) => (
                <li key={comment.id} className="py-3">
                  <p className="font-medium">{comment.name}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {comment.comment}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    on {comment.post_id} &middot;{" "}
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
