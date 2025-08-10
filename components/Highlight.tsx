/**
 * @file A utility component that wraps matching substrings in a <mark> tag.
 * It's case-insensitive and safely handles special characters in the highlight query.
 */
import React from 'react';

interface HighlightProps {
  text?: string;
  highlight?: string;
}

const Highlight: React.FC<HighlightProps> = ({ text, highlight }) => {
  if (!highlight?.trim() || !text) {
    return <>{text || ''}</>;
  }

  // Escape special regex characters to prevent errors from user input.
  const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const safeHighlight = escapeRegExp(highlight.trim());
  const regex = new RegExp(`(${safeHighlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => 
        // Matched parts are at odd indices because of the capturing group in the regex.
        regex.test(part) ? (
          <mark key={index} className="highlight-mark bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export default Highlight;