import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';

export interface CommunityCardProps {
  id: string;
  type: 'study' | 'project';
  title: string;
  thumbnail: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  views: number;
  comments: number;
  likes: number;
  status: 'recruiting' | 'completed';
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  id,
  type,
  title,
  thumbnail,
  tags,
  author,
  views,
  comments,
  likes,
  status,
}) => {
  return (
    <Link href={`/community/${id}`}>
      <div className="flex flex-col gap-3 pb-3 bg-white dark:bg-gray-800/50 rounded-xl p-4 transition-transform hover:-translate-y-1">
        <div className="relative w-full">
          <div className="w-full aspect-[4/3] bg-cover bg-center rounded-lg relative overflow-hidden">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <Badge
            variant={status === 'recruiting' ? 'primary' : 'gray'}
            className="absolute top-2 left-2"
          >
            {status === 'recruiting' ? '모집중' : '모집완료'}
          </Badge>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">
            [{type === 'study' ? '스터디' : '프로젝트'}]
          </p>
          <p className="text-gray-900 dark:text-white text-base font-bold leading-normal truncate">
            {title}
          </p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Avatar src={author.avatar} alt={author.name} size="xs" />
            <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">
              {author.name}
            </p>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-normal mt-2">
            조회수 {views} | 댓글 {comments} | 좋아요 {likes}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
