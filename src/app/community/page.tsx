import React from 'react';
import CommunityCard from '@/components/community/CommunityCard';
import Button from '@/components/common/Button';

export default function CommunityPage() {
  const posts = [
    {
      id: '1',
      type: 'project' as const,
      title: "사이드 프로젝트: '오늘의 회고' 웹 서비스",
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      tags: ['React', 'Node.js'],
      author: {
        name: '김코딩',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      views: 128,
      comments: 12,
      likes: 25,
      status: 'recruiting' as const,
    },
    {
      id: '2',
      type: 'study' as const,
      title: '알고리즘 스터디 주 2회 진행합니다',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      tags: ['Python', '코딩테스트'],
      author: {
        name: '이학습',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      views: 99,
      comments: 8,
      likes: 15,
      status: 'recruiting' as const,
    },
    {
      id: '3',
      type: 'study' as const,
      title: 'UI/UX 포트폴리오 스터디 모집',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      tags: ['UIUX', 'Figma'],
      author: {
        name: '박디자인',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      views: 250,
      comments: 22,
      likes: 40,
      status: 'completed' as const,
    },
    {
      id: '4',
      type: 'project' as const,
      title: 'Node.js 백엔드 개발 프로젝트 팀원 구해요',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      tags: ['Node.js', 'Backend'],
      author: {
        name: '최백엔',
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
      views: 88,
      comments: 5,
      likes: 18,
      status: 'recruiting' as const,
    },
    {
      id: '5',
      type: 'study' as const,
      title: '데이터 분석 공모전 준비 스터디',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      tags: ['Data', 'Pandas'],
      author: {
        name: '정데이터',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      views: 150,
      comments: 14,
      likes: 30,
      status: 'completed' as const,
    },
    {
      id: '6',
      type: 'project' as const,
      title: 'React Native 앱 개발 프로젝트',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      tags: ['ReactNative', 'Mobile'],
      author: {
        name: '앱개발러',
        avatar: 'https://i.pravatar.cc/150?img=6',
      },
      views: 75,
      comments: 10,
      likes: 20,
      status: 'recruiting' as const,
    },
    {
      id: '7',
      type: 'study' as const,
      title: '클라우드 자격증 취득 스터디',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      tags: ['AWS', 'DevOps'],
      author: {
        name: '강인프라',
        avatar: 'https://i.pravatar.cc/150?img=7',
      },
      views: 110,
      comments: 9,
      likes: 22,
      status: 'recruiting' as const,
    },
    {
      id: '8',
      type: 'project' as const,
      title: '블록체인 기반 보안 솔루션 개발',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      tags: ['Blockchain', 'Security'],
      author: {
        name: '나보안',
        avatar: 'https://i.pravatar.cc/150?img=8',
      },
      views: 180,
      comments: 18,
      likes: 35,
      status: 'completed' as const,
    },
  ];

  const categories = ['전체', '스터디', '프로젝트', 'Python', 'React', 'UI/UX', '모집중'];

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="layout-content-container flex flex-col max-w-[1280px] flex-1">
        <div className="flex flex-wrap justify-between items-center gap-4 p-4">
          <div className="flex flex-col gap-2">
            <p className="text-gray-900 dark:text-white text-4xl font-black tracking-[-0.033em]">
              커뮤니티 허브
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-base font-normal">
              함께 성장할 동료를 찾아보세요! 스터디와 프로젝트에 참여하고 실력을 키워나가세요.
            </p>
          </div>
          <Button variant="primary">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              edit
            </span>
            <span>새 글 작성</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 cursor-pointer ${
                index === 0
                  ? 'bg-primary/20 text-primary'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <p className={`text-sm ${index === 0 ? 'font-bold' : 'font-medium'}`}>
                {category}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {posts.map((post) => (
            <CommunityCard key={post.id} {...post} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center p-4 mt-6">
          <a
            className="flex size-10 items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            href="#"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </a>
          <a
            className="text-sm font-bold flex size-10 items-center justify-center text-white rounded-full bg-primary"
            href="#"
          >
            1
          </a>
          <a
            className="text-sm font-normal flex size-10 items-center justify-center text-gray-900 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            href="#"
          >
            2
          </a>
          <a
            className="text-sm font-normal flex size-10 items-center justify-center text-gray-900 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            href="#"
          >
            3
          </a>
          <a
            className="text-sm font-normal flex size-10 items-center justify-center text-gray-900 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            href="#"
          >
            4
          </a>
          <a
            className="text-sm font-normal flex size-10 items-center justify-center text-gray-900 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            href="#"
          >
            5
          </a>
          <a
            className="flex size-10 items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            href="#"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </a>
        </div>
      </div>
    </div>
  );
}
