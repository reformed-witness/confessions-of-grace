"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteSubscription(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete subscription: ${error.message}`);
  }

  revalidatePath("/admin/subscriptions");
}
