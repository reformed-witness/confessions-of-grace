import { supabase } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server'; // Use next/server for Edge runtime

export const runtime = 'edge';

export default async function POST(req: NextRequest) {
  // Only allow POST requests - this is handled by exporting the POST function

  const { email } = await req.json(); // Get body from Edge request

  // Check if email was provided
  if (!email) {
    return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
  }

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ message: 'Invalid email address.' }, { status: 400 });
  }

  try {
    // Check if the email already exists in the 'subscriptions' table
    const { data: existingEmails, error: selectError } = await supabase
      .from('subscriptions') // Replace 'subscriptions' with your Supabase table name
      .select('email')
      .eq('email', email);

    if (selectError) {
      console.error('Error checking existing email:', selectError);
      return NextResponse.json({ message: 'An unexpected error occurred while checking email.' }, { status: 500 });
    }

    if (existingEmails && existingEmails.length > 0) {
      return NextResponse.json({ message: 'Email is already subscribed.' }, { status: 400 });
    }

    // Save email to the 'subscriptions' table
    const { data: insertedData, error: insertError } = await supabase
      .from('subscriptions') // Replace 'subscriptions' with your Supabase table name
      .insert([
        {
          email,
          created_at: new Date().toISOString(), 
        },
      ]);

    if (insertError) {
      console.error('Failed to save subscription:', insertError);
      return NextResponse.json({ message: 'An unexpected error occurred while saving subscription.' }, { status: 500 });
    }

    // Respond with success
    return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 200 });

  } catch (error) {
    // Log unexpected errors
    console.error('An unexpected server error occurred:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}