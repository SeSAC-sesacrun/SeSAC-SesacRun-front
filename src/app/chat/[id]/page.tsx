'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ChatPage() {
    const params = useParams();
    const chatId = params.id;
    const [message, setMessage] = useState('');

    // 사용자 role (실제로는 API에서 가져올 데이터)
    const userRole = 'participant'; // 'participant' | 'organizer'

    const chats = [
        {
            id: '1',
            name: '총괄 매니저',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            lastMessage: '네, 확인 후 바로 답변...',
            time: '오후 2:45',
            unread: 1,
            online: true,
            active: chatId === '1',
        },
        {
            id: '2',
            name: '[React] 강사',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            lastMessage: '안녕하세요! 질문 확인했습니다.',
            time: '어제',
            unread: 0,
            online: false,
            active: chatId === '2',
        },
        {
            id: '3',
            name: '고객센터',
            avatar: '',
            lastMessage: '문의주셔서 감사합니다.',
            time: '10월 25일',
            unread: 0,
            online: false,
            active: chatId === '3',
        },
    ];

    const currentChat = chats.find((chat) => chat.id === chatId) || chats[0];

    const messages = [
        {
            type: 'received',
            content: '안녕하세요, 김민준님. 문의주신 내용 확인했습니다. 어떤 도움이 필요하신가요?',
            time: '오후 2:42',
            avatar: currentChat.avatar,
        },
        {
            type: 'sent',
            content: '안녕하세요. React 심화 과정 3강의 소스코드 관련해서 질문이 있습니다.',
            time: '오후 2:43',
        },
        {
            type: 'sent',
            content: '강의 자료에 포함된 코드와 실제 영상에서 보여주시는 코드가 일부 다른 것 같아서요. 확인 부탁드립니다!',
            time: '오후 2:43',
        },
        {
            type: 'received',
            content: '네, 확인 후 바로 답변드리겠습니다. 잠시만 기다려주세요.',
            time: '오후 2:45',
            avatar: currentChat.avatar,
        },
    ];

    const handleApply = () => {
        alert('참여 신청이 완료되었습니다!');
    };

    const handleApprove = () => {
        alert('참여를 승인했습니다!');
    };

    const handleReject = () => {
        alert('참여를 거절했습니다.');
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Chat List */}
                <aside className="w-[360px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">1:1 문의</h1>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col">
                            {chats.map((chat) => (
                                <Link
                                    key={chat.id}
                                    href={`/chat/${chat.id}`}
                                    className={`flex items-center gap-4 px-4 min-h-[80px] py-3 justify-between ${chat.active
                                            ? 'bg-primary/10 dark:bg-primary/20 border-r-4 border-primary'
                                            : 'border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="relative shrink-0">
                                            {chat.avatar ? (
                                                <div
                                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-14"
                                                    style={{ backgroundImage: `url('${chat.avatar}')` }}
                                                />
                                            ) : (
                                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-14 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400" style={{ fontSize: '32px' }}>
                                                        support_agent
                                                    </span>
                                                </div>
                                            )}
                                            {chat.online && (
                                                <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center overflow-hidden">
                                            <p className="text-gray-900 dark:text-white text-base font-bold leading-normal truncate">
                                                {chat.name}
                                            </p>
                                            <p
                                                className={`text-sm font-medium leading-normal truncate ${chat.active ? 'text-primary dark:text-primary/90' : 'text-gray-500 dark:text-gray-400'
                                                    }`}
                                            >
                                                {chat.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-1">
                                        <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">
                                            {chat.time}
                                        </p>
                                        {chat.unread > 0 && (
                                            <div className="size-5 bg-primary text-white text-xs flex items-center justify-center rounded-full font-bold">
                                                {chat.unread}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="flex flex-1 flex-col bg-background-light dark:bg-background-dark">
                    {/* Chat Header */}
                    <header className="flex-shrink-0 flex items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            {currentChat.avatar ? (
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                                    style={{ backgroundImage: `url('${currentChat.avatar}')` }}
                                />
                            ) : (
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                                        support_agent
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{currentChat.name}</h2>
                                <div className="flex items-center gap-2">
                                    {currentChat.online && <div className="size-2 bg-green-500 rounded-full" />}
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {currentChat.online ? '온라인' : '오프라인'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Role-based Action Buttons */}
                        <div className="flex gap-2">
                            {userRole === 'participant' ? (
                                <button
                                    onClick={handleApply}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    <span>신청하기</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleApprove}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">check</span>
                                        <span>승인</span>
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">close</span>
                                        <span>거절</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </header>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
                            2023년 10월 27일
                        </div>

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-end gap-3 max-w-xl ${msg.type === 'sent' ? 'ml-auto flex-row-reverse' : ''
                                    }`}
                            >
                                {msg.type === 'received' && msg.avatar && (
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0"
                                        style={{ backgroundImage: `url('${msg.avatar}')` }}
                                    />
                                )}
                                <div className={`flex flex-col gap-1 ${msg.type === 'sent' ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`p-3 rounded-lg shadow-sm ${msg.type === 'sent'
                                                ? 'bg-primary text-white rounded-br-none'
                                                : 'bg-white dark:bg-gray-700 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm text-black dark:text-white">
                                            {msg.content}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <input
                                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg focus:ring-primary focus:border-primary text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="메시지를 입력하세요..."
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        setMessage('');
                                    }
                                }}
                            />
                            <button className="flex-shrink-0 size-11 flex items-center justify-center bg-black dark:bg-primary text-white rounded-lg hover:bg-black/90 dark:hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-primary dark:focus:ring-offset-background-dark">
    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
        send
    </span>
</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
