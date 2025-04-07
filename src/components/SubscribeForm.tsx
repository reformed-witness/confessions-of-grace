import React, { useState } from 'react';

interface SubscribeFormProps {
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({
  placeholder = 'Your email',
  buttonLabel = 'Subscribe',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('You have successfully subscribed!');
        setEmail('');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className={`space-y-3 ${className}`}>
      <div>
        <input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        className="button w-full"
        disabled={loading}
      >
        {loading ? 'Subscribing...' : buttonLabel}
      </button>
      {message && <p className="text-sm text-primary-700">{message}</p>}
    </form>
  );
};

export default SubscribeForm;