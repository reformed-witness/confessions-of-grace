"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteComment(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("comments").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }

  revalidatePath("/admin/comments");
}
