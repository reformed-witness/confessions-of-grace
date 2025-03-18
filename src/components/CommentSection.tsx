import React, { useState } from 'react';

interface CommentFormProps {
  postId: string;
}

const CommentSection: React.FC<CommentFormProps> = ({ postId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !email.trim() || !comment.trim()) {
      setError('All fields are required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real implementation, you would send this data to your API
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear form and show success message
      setName('');
      setEmail('');
      setComment('');
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
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
          Your comment has been submitted and is awaiting moderation. Thank you!
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
      
      {/* Sample comments - in a real implementation, these would be fetched from an API */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">Comments (2)</h3>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm border border-primary-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold">John Calvin</h4>
                <p className="text-sm text-primary-500">March 10, 2025</p>
              </div>
            </div>
            <p className="text-primary-700">
              A profound meditation on the doctrine of grace. I particularly appreciate your emphasis on how this truth transforms our daily lives, not just our theological understanding.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-md shadow-sm border border-primary-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold">Martin Luther</h4>
                <p className="text-sm text-primary-500">March 5, 2025</p>
              </div>
            </div>
            <p className="text-primary-700">
              This post eloquently articulates what I've been trying to explain to my congregation. The way you connected Scripture with practical application was masterful. I'll be sharing this widely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;