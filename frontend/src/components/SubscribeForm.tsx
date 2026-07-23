import { useState } from 'react';
import type { FormEvent } from 'react';
import { subscribe } from '../api';
import { cn } from '../lib/utils';

interface Props {
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

export default function SubscribeForm({
  placeholder = 'Your email',
  buttonLabel = 'Subscribe',
  className,
}: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState('busy');
    try {
      await subscribe(email.trim());
      setState('done');
      setEmail('');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return <p className="text-sm text-accent-light">Thank you — you&apos;re subscribed.</p>;
  }

  return (
    <form onSubmit={onSubmit} className={cn('flex flex-col space-y-2', className)}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        aria-label="Email address"
        className="field"
      />
      <button type="submit" className="button" disabled={state === 'busy'}>
        {state === 'busy' ? 'Subscribing…' : buttonLabel}
      </button>
      {state === 'error' && <p className="text-sm text-red-300">Something went wrong. Please try again.</p>}
    </form>
  );
}
