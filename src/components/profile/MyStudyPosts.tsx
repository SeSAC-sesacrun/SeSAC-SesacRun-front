import React from 'react';
import Link from 'next/link';

interface StudyPost {
    id: string;
    category: string;
    status: string;
    title: string;
    currentMembers: number;
    totalMembers: number;
    views: number;
}

interface MyStudyPostsProps {
    posts: StudyPost[];
}

export default function MyStudyPosts({ posts }: MyStudyPostsProps) {
    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="block bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className={`text-xs px-2 py-1 rounded font-bold ${post.status === 'recruiting'
                                ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            {post.status === 'recruiting' ? '모집중' : '모집완료'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {post.currentMembers}/{post.totalMembers}명
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                        {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        조회수 {post.views.toLocaleString()}
                    </p>
                </Link>
            ))}
        </div>
    );
}
