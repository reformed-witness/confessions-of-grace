import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateAdminRole, removeAdmin } from "./actions";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Verify current user is super_admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: currentAdmin } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!currentAdmin || currentAdmin.role !== "super_admin") {
    redirect("/admin");
  }

  const { data: adminUsers } = await supabase
    .from("admin_users")
    .select("id, user_id, email, role, created_at")
    .order("created_at");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Users</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adminUsers?.map((adminUser) => (
              <tr key={adminUser.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{adminUser.email}</td>
                <td className="px-6 py-4">
                  <form className="inline">
                    <select
                      defaultValue={adminUser.role}
                      onChange={async (e) => {
                        "use server";
                      }}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                      disabled={adminUser.user_id === user.id}
                    >
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </form>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {new Date(adminUser.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {adminUser.user_id !== user.id && (
                    <div className="flex justify-end gap-2">
                      {(["editor", "admin", "super_admin"] as const)
                        .filter((r) => r !== adminUser.role)
                        .map((role) => (
                          <form
                            key={role}
                            action={updateAdminRole.bind(
                              null,
                              adminUser.id,
                              role
                            )}
                            className="inline"
                          >
                            <button
                              type="submit"
                              className="text-xs text-accent hover:text-accent-dark capitalize"
                            >
                              Make {role.replace("_", " ")}
                            </button>
                          </form>
                        ))}
                      <form
                        action={removeAdmin.bind(null, adminUser.id)}
                        className="inline"
                      >
                        <button
                          type="submit"
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!adminUsers || adminUsers.length === 0) && (
          <p className="text-gray-500 text-center py-8">
            No admin users found.
          </p>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Admin User</h2>
        <p className="text-gray-600 text-sm mb-4">
          The user must first have a Supabase Auth account. Create one in the
          Supabase dashboard, then add their email here.
        </p>
        <form
          action={async (formData: FormData) => {
            "use server";
            const { createClient } = await import(
              "@/utils/supabase/server"
            );
            const { revalidatePath } = await import("next/cache");
            const supabase = await createClient();
            const email = formData.get("email") as string;
            const role = formData.get("role") as string;
            const userId = formData.get("user_id") as string;

            await supabase.from("admin_users").insert({
              email,
              role,
              user_id: userId,
            });

            revalidatePath("/admin/users");
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auth User ID (UUID)
            </label>
            <input
              type="text"
              name="user_id"
              required
              placeholder="00000000-0000-0000-0000-000000000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-accent text-white px-6 py-2 rounded-md hover:bg-accent-dark"
          >
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
}
