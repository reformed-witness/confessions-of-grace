import React from 'react';
import { format, parseISO } from 'date-fns';

interface DateFormatterProps {
  dateString: string;
  formatString?: string;
  className?: string;
}

const DateFormatter: React.FC<DateFormatterProps> = ({ 
  dateString, 
  formatString = 'MMMM d, yyyy',
  className = ''
}) => {
  const date = parseISO(dateString);
  return (
    <time dateTime={dateString} className={className}>
      {format(date, formatString)}
    </time>
  );
};

export default DateFormatter;