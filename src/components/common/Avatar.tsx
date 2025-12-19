import React from 'react';
import Image from 'next/image';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  if (!src) {
    return (
      <div
        className={`${sizeStyles[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
      >
        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
          person
        </span>
      </div>
    );
  }

  return (
    <div className={`${sizeStyles[size]} rounded-full overflow-hidden relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
};

export default Avatar;
