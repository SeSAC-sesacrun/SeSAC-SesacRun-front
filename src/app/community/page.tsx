'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CommunityPage() {
  const [category, setCategory] = useState<'study' | 'project'>('study');
  const [filter, setFilter] = useState<'all' | 'recruiting' | 'completed'>('all');

  const posts = [
    {
      id: '1',
      category: 'study',
      status: 'recruiting',
      title: '프론트엔드 실전 프로젝트 스터디원 모집',
      description: 'React와 TypeScript를 사용한 실전 프론트엔드 프로젝트를 함께 진행할 스터디원을 모집합니다.',
      author: '강민준',
      views: 1234,
      currentMembers: 8,
      totalMembers: 10,
    },
    {
      id: '2',
      category: 'project',
      status: 'recruiting',
      title: 'AI 챗봇 서비스 개발 팀원 모집',
      description: 'GPT API를 활용한 AI 챗봇 서비스를 함께 개발할 팀원을 모집합니다. 백엔드/프론트엔드 모두 환영!',
      author: '김개발',
      views: 856,
      currentMembers: 3,
      totalMembers: 5,
    },
    {
      id: '3',
      category: 'study',
      status: 'completed',
      title: 'Node.js 백엔드 스터디 (모집완료)',
      description: 'Node.js와 Express를 활용한 백엔드 개발 스터디입니다.',
      author: '박서버',
      views: 2341,
      currentMembers: 10,
      totalMembers: 10,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const categoryMatch = post.category === category;
    const filterMatch =
      filter === 'all' ||
      (filter === 'recruiting' && post.status === 'recruiting') ||
      (filter === 'completed' && post.status === 'completed');
    return categoryMatch && filterMatch;
  });

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">커뮤니티</h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            함께 성장할 스터디원과 프로젝트 팀원을 찾아보세요
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCategory('study')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${category === 'study'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            스터디
          </button>
          <button
            onClick={() => setCategory('project')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${category === 'project'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            팀 프로젝트
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('recruiting')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'recruiting'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              모집중
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              모집완료
            </button>
          </div>
          <Link
            href="/community/create"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>모집 글 작성</span>
          </Link>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${post.status === 'recruiting'
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">person</span>
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        {post.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">해당하는 모집 글이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
