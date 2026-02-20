import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { name, email, comment, postId } = await req.json();

    if (!name || !email || !comment || !postId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("comments").insert([
      {
        name,
        email,
        comment,
        post_id: postId,
      },
    ]);

    if (error) {
      console.error("Error inserting comment:", error);
      return NextResponse.json(
        { message: "Error submitting comment", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Comment submitted successfully", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal server error during POST:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json(
        { message: "Error fetching comments", error },
        { status: 500 }
      );
    }

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Internal server error during GET:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
