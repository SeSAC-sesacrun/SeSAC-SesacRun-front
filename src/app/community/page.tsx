'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  postId: number;
  title: string;
  content: string;
  status: string;
  authorName: string;
  views: number;
  currentMembers: number;
  totalMembers: number;
  createdAt: string;
  author: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    content: Post[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    first: boolean;
    last: boolean;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
  };
}

export default function CommunityPage() {
  const [category, setCategory] = useState<'study' | 'project'>('study');
  const [filter, setFilter] = useState<'all' | 'recruiting' | 'completed'>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // category를 백엔드 형식에 맞게 변환 (STUDY, PROJECT)
        const categoryParam = category.toUpperCase();

        // filter를 백엔드 형식에 맞게 변환 (RECRUITING, COMPLETED)
        const statusParam = filter === 'all' ? '' : filter.toUpperCase();

        // URL 생성
        const url = new URL('http://localhost:8080/api/recruitments/posts');
        url.searchParams.append('category', categoryParam);
        if (statusParam) {
          url.searchParams.append('status', statusParam);
        }

        // 헤더 구성 (토큰이 있으면 포함)
        const headers: HeadersInit = {};
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(url.toString(), { headers });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data.content) {
          setPosts(result.data.content);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, filter]);

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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('recruiting')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'recruiting'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              모집중
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'completed'
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => {
              // 백엔드에서 받은 status 사용
              const isRecruiting = post.status === 'RECRUITING';

              return (
                <Link
                  key={post.postId}
                  href={`/community/${post.postId}`}
                  className="block bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${isRecruiting
                            ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                          {isRecruiting ? '모집중' : '모집완료'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {post.currentMembers}/{post.totalMembers}명
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">person</span>
                          {post.authorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
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
