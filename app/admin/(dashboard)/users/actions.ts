"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAdminRole(
  adminId: string,
  newRole: "super_admin" | "admin" | "editor"
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("admin_users")
    .update({ role: newRole })
    .eq("id", adminId);

  if (error) {
    throw new Error(`Failed to update role: ${error.message}`);
  }

  revalidatePath("/admin/users");
}

export async function removeAdmin(adminId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", adminId);

  if (error) {
    throw new Error(`Failed to remove admin: ${error.message}`);
  }

  revalidatePath("/admin/users");
}

export async function inviteAdmin(email: string, role: string) {
  const supabase = await createClient();

  // Check if user exists in auth
  // Note: This requires admin API access. For now, we just add to admin_users
  // The user must already have a Supabase Auth account.

  // Look up user by email in admin_users to prevent duplicates
  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    throw new Error("This email is already an admin.");
  }

  // We need the user's auth ID. Look them up via the admin_users approach:
  // The admin must create the auth user first via Supabase dashboard,
  // then add them here with their user_id.
  // For a simpler flow, we'll insert with just email and let super_admin
  // provide the user_id separately.

  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error("Not authenticated");

  // This is a simplified version - in production you'd use the admin API
  // to look up or invite the user
  const { error } = await supabase.from("admin_users").insert({
    email,
    role,
    user_id: "00000000-0000-0000-0000-000000000000", // placeholder - must be updated
  });

  if (error) {
    throw new Error(`Failed to invite admin: ${error.message}`);
  }

  revalidatePath("/admin/users");
}
