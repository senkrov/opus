import React from 'react';

interface HighlightProps {
  text?: string;
  highlight?: string;
}

const Highlight: React.FC<HighlightProps> = ({ text, highlight }) => {
  // If no highlight query or text, return text as is.
  if (!highlight?.trim() || !text) {
    return <>{text || ''}</>;
  }

  const escapeRegExp = (str: string) => {
    // Escape characters with special meaning in regular expressions to prevent errors.
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const safeHighlight = escapeRegExp(highlight.trim());
  // Create a case-insensitive regex with a capturing group for the highlight term.
  const regex = new RegExp(`(${safeHighlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        // The `split` method with a capturing group includes the matched separators in the
        // resulting array. These matches will always be at odd-numbered indices.
        if (index % 2 === 1) {
          return (
            <mark key={index} className="highlight-mark bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5">
              {part}
            </mark>
          );
        }
        // Non-matching parts are at even-numbered indices.
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export default Highlight;