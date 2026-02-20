"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAuthor(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const x_link = (formData.get("x_link") as string) || null;
  const fb_link = (formData.get("fb_link") as string) || null;
  const insta_link = (formData.get("insta_link") as string) || null;
  const pfp_link = (formData.get("pfp_link") as string) || null;

  const { error } = await supabase.from("authors").insert({
    name,
    bio,
    x_link,
    fb_link,
    insta_link,
    pfp_link,
  });

  if (error) {
    throw new Error(`Failed to create author: ${error.message}`);
  }

  revalidatePath("/authors");
  revalidatePath("/admin/authors");
  redirect("/admin/authors");
}

export async function updateAuthor(formData: FormData) {
  const supabase = await createClient();

  const originalName = formData.get("originalName") as string;
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const x_link = (formData.get("x_link") as string) || null;
  const fb_link = (formData.get("fb_link") as string) || null;
  const insta_link = (formData.get("insta_link") as string) || null;
  const pfp_link = (formData.get("pfp_link") as string) || null;

  const { error } = await supabase
    .from("authors")
    .update({ name, bio, x_link, fb_link, insta_link, pfp_link })
    .eq("name", originalName);

  if (error) {
    throw new Error(`Failed to update author: ${error.message}`);
  }

  revalidatePath("/authors");
  revalidatePath("/admin/authors");
  redirect("/admin/authors");
}

export async function deleteAuthor(name: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("authors").delete().eq("name", name);

  if (error) {
    throw new Error(`Failed to delete author: ${error.message}`);
  }

  revalidatePath("/authors");
  revalidatePath("/admin/authors");
}
