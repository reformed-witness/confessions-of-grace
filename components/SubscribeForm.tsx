"use client"

import React, { useState } from 'react';

interface SubscribeFormProps {
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

// Email subscriptions require a backend which has been removed for the static
// build. This form is a no-op: it never calls any API and simply informs the
// user that subscriptions are unavailable.
const SubscribeForm: React.FC<SubscribeFormProps> = ({
  placeholder = 'Your email',
  buttonLabel = 'Subscribe',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Subscriptions are currently unavailable.');
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
      >
        {buttonLabel}
      </button>
      {message && <p className="text-sm text-primary-700">{message}</p>}
    </form>
  );
};

export default SubscribeForm;
