import React, { useState, useEffect } from 'react';

interface CommentFormProps {
  postId: string;
}

interface Comment {
  name: string;
  comment: string;
  createdAt: string;
}

const CommentSection: React.FC<CommentFormProps> = ({ postId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${postId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !comment.trim()) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, comment, postId }),
      });

      if (response.ok) {
        setName('');
        setEmail('');
        setComment('');
        setIsSubmitted(true);
        setIsSubmitting(false);

        // Fetch updated comments
        const updatedComments = await fetch(`/api/comments?postId=${postId}`).then((res) =>
          res.json()
        );
        setComments(updatedComments);

        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong. Please try again later.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
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

        <div className="flex items-center">
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
        </div>

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

        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.createdAt}
              className="bg-white p-6 rounded-md shadow-sm border border-primary-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold">{comment.name}</h4>
                  <p className="text-sm text-primary-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-primary-700">{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;