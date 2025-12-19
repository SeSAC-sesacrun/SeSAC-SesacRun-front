import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  instructor,
  thumbnail,
  rating,
  reviewCount,
  price,
  originalPrice,
}) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Link href={`/courses/${id}`}>
      <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <div className="relative w-full h-48">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{instructor}</p>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-auto">
            <span className="material-symbols-outlined fill text-yellow-500 !text-base mr-1">
              star
            </span>
            <span>
              {rating.toFixed(1)} ({reviewCount.toLocaleString()})
            </span>
            <div className="ml-auto flex items-center gap-2">
              {originalPrice && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₩{originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                ₩{price.toLocaleString()}
              </span>
            </div>
          </div>
          {discount > 0 && (
            <div className="mt-2">
              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">
                {discount}% 할인
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
