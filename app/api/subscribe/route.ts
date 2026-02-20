import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { message: "Email is required." },
      { status: 400 }
    );
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { message: "Invalid email address." },
      { status: 400 }
    );
  }

  try {
    const { data: existingEmails, error: selectError } = await supabase
      .from("subscriptions")
      .select("email")
      .eq("email", email);

    if (selectError) {
      console.error("Error checking existing email:", selectError);
      return NextResponse.json(
        { message: "An unexpected error occurred while checking email." },
        { status: 500 }
      );
    }

    if (existingEmails && existingEmails.length > 0) {
      return NextResponse.json(
        { message: "Email is already subscribed." },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from("subscriptions")
      .insert([{ email }]);

    if (insertError) {
      console.error("Failed to save subscription:", insertError);
      return NextResponse.json(
        {
          message:
            "An unexpected error occurred while saving subscription.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully subscribed!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected server error occurred:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
