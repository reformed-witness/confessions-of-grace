"use client"

import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
import React, { useState, useEffect } from 'react';

interface CommentFormProps {
  postId: string;
}

interface Comment {
  id: number; // Supabase tables typically have an ID
  name: string;
  comment: string;
  created_at: string; // Use the Supabase column name
}

const CommentSection: React.FC<CommentFormProps> = ({ postId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true); // Add loading state

  // Fetch comments when the component mounts or postId changes
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoadingComments(true); // Set loading to true
      const { data, error } = await supabase
        .from('comments') // Replace 'comments' with your Supabase table name
        .select('id, name, comment, created_at') // Select specific columns
        .eq('post_id', postId) // Filter by post_id
        .order('created_at', { ascending: false }); // Order by creation date

      if (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments.'); // Display error to user
        setComments([]); // Clear comments on error
      } else {
        setComments(data || []); // Set comments (handle case where data is null)
        setError(null); // Clear any previous errors
      }
      setIsLoadingComments(false); // Set loading to false
    };

    fetchComments();

    // Optional: Set up real-time subscriptions for new comments
    // Be mindful of performance and resource usage with real-time subscriptions
    // This is a basic example; you might need more sophisticated handling
    const subscription = supabase
      .channel(`comments:post_id=eq.${postId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, (payload) => {
        // Add the new comment to the beginning of the list
        setComments((currentComments) => [payload.new as Comment, ...currentComments]);
      })
      .subscribe();

    // Cleanup the subscription when the component unmounts or postId changes
    return () => {
      supabase.removeChannel(subscription);
    };

  }, [postId]); // Dependency array includes postId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !comment.trim()) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('comments') // Replace 'comments' with your Supabase table name
        .insert([
          {
            name,
            email, // Storing email is dependent on your privacy policy and RLS
            comment,
            post_id: postId, // Assuming your Supabase column is named 'post_id'
            // created_at will likely be automatically set by Supabase with a default value
          },
        ])
        .select('id, name, comment, created_at'); // Select the inserted data

      if (error) {
        console.error('Error inserting comment:', error);
        setError(error.message || 'Something went wrong. Please try again later.');
      } else {
        // Assuming real-time subscription is active,
        // the new comment will be added to the comments state automatically.
        // If not using real-time, you would manually add the new comment here:
        // if (data && data.length > 0) {
        //   setComments((currentComments) => [data[0], ...currentComments]);
        // }

        setName('');
        setEmail('');
        setComment('');
        setIsSubmitted(true);
        // No need to re-fetch all comments if using real-time subscriptions

        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (err) {
      console.error('Unexpected error during submission:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-6 border-t border-primary-200">
      <h3 className="text-2xl font-bold mb-6">Leave a Comment</h3>

      {isSubmitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
          Your comment has been submitted. Thank you!
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-primary-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
              onFocus={() => {
                if (typeof window !== 'undefined') {
                  const savedName = localStorage.getItem('name');
                  if (savedName) setName(savedName);
                }
              }}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-primary-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
              onFocus={() => {
                if (typeof window !== 'undefined') {
                  const savedEmail = localStorage.getItem('email');
                  if (savedEmail) setEmail(savedEmail);
                }
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-primary-700 mb-1">
            Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            rows={6}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            required
          ></textarea>
        </div>

        {/* The save info checkbox logic can remain as it interacts with localStorage */}
         {/* <div className="flex items-center">
           <input
             type="checkbox"
             id="save-info"
             className="h-4 w-4 text-accent border-primary-300 rounded focus:ring-accent"
             checked={typeof window !== 'undefined' && localStorage.getItem('saveInfo') === 'true'}
             onChange={(e) => {
               if (typeof window !== 'undefined') {
                 const saveInfo = e.target.checked;
                 localStorage.setItem('saveInfo', saveInfo.toString());
                 if (saveInfo) {
                   localStorage.setItem('name', name);
                   localStorage.setItem('email', email);
                 } else {
                   localStorage.removeItem('name');
                   localStorage.removeItem('email');
                 }
               }
             }}
           />
           <label htmlFor="save-info" className="ml-2 block text-sm text-primary-600">
             Save my name and email for the next time I comment
           </label>
         </div> */}

        <button
          type="submit"
          className="button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Post Comment'}
        </button>
      </form>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>

        {isLoadingComments ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p>No comments yet. Be the first to leave one!</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                // Use a more stable key than createdAt if possible, like comment.id from Supabase
                key={comment.id || comment.created_at}
                className="bg-white p-6 rounded-md shadow-sm border border-primary-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold">{comment.name}</h4>
                    <p className="text-sm text-primary-500">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-primary-700">{comment.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;