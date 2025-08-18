import { supabase } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server'; // Use next/server for Edge runtime

export const runtime = 'edge';

export default async function POST(req: NextRequest) {
  try {
    const { name, email, comment, postId } = await req.json();

    if (!name || !email || !comment || !postId) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Insert data into the 'comments' table
    const { data, error } = await supabase
      .from('comments') // Replace 'comments' with your Supabase table name
      .insert([
        {
          name,
          email,
          comment,
          post_id: postId,
          created_at: new Date().toISOString(), // Supabase often uses ISO strings for timestamps
        },
      ]);

    if (error) {
      console.error('Error inserting comment:', error);
      return NextResponse.json({ message: 'Error submitting comment', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Comment submitted successfully', data }, { status: 201 });
  } catch (error) {
    console.error('Internal server error during POST:', error);
    // Catching and returning a 500 for unexpected errors
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    // Fetch comments for a specific postId, ordered by creation date descending
    const { data: comments, error } = await supabase
      .from('comments') // Replace 'comments' with your Supabase table name
      .select('*')
      .eq('post_id', postId) // Assuming your Supabase column for post ID is 'post_id'
      .order('created_at', { ascending: false }); // Assuming your timestamp column is 'created_at'

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ message: 'Error fetching comments', error }, { status: 500 });
    }

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Internal server error during GET:', error);
    // Catching and returning a 500 for unexpected errors
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}