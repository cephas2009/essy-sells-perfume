import React from "react";

// A four-point sparkle/star, fills its parent's box (width/height set by parent)
export const Sparkle: React.FC = () => {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path
        d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z"
        fill="currentColor"
      />
    </svg>
  );
};
