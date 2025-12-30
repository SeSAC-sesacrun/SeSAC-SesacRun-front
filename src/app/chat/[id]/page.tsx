'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ChatMessage {
    type: 'sent' | 'received';
    content: string;
    time: string;
    senderName?: string;
}

export default function ChatPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const chatId = params.id as string;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // URL 쿼리 파라미터에서 상대방 정보 가져오기
    const opponentName = searchParams.get('opponentName') || '상대방';
    const postId = searchParams.get('postId');

    // 웹소켓 연결
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            alert('로그인이 필요합니다.');
            router.push('/login');
            return;
        }

        if (!chatId) {
            return;
        }

        // STOMP 클라이언트 생성 (SockJS 사용)
        const client = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8080/ws-stomp?token=${accessToken}`),
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            debug: (str) => {
                console.log('STOMP:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('✅ WebSocket Connected');
            setIsConnected(true);

            // 채팅방 구독
            client.subscribe(`/sub/chat/room/${chatId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log('📩 Received:', receivedMessage);

                // 메시지를 채팅 목록에 추가
                const newMessage: ChatMessage = {
                    type: receivedMessage.isMine ? 'sent' : 'received',
                    content: receivedMessage.message || receivedMessage.content,
                    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                    senderName: receivedMessage.senderName,
                };

                setMessages((prev) => [...prev, newMessage]);
            });
        };

        client.onStompError = (frame) => {
            console.error('❌ STOMP Error:', frame);
            setIsConnected(false);
        };

        client.onWebSocketClose = () => {
            console.log('🔌 WebSocket Disconnected');
            setIsConnected(false);
        };

        client.activate();
        stompClientRef.current = client;

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [chatId, router]);

    // 메시지 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 메시지 전송
    const handleSendMessage = () => {
        if (!message.trim() || !isConnected || !stompClientRef.current) {
            if (!isConnected) {
                alert('채팅 서버에 연결되지 않았습니다.');
            }
            return;
        }

        const messageData = {
            roomId: chatId,
            message: message.trim(),
        };

        // 서버로 메시지 전송
        stompClientRef.current.publish({
            destination: `/pub/chat/message`,
            body: JSON.stringify(messageData),
        });

        console.log('📤 Sent:', messageData);
        setMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Chat Room List */}
                <aside className="w-[360px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">채팅</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {isConnected ? '연결됨' : '연결 중...'}
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col">
                            {/* 현재 채팅방 (활성화) */}
                            <div className="flex items-center gap-4 px-4 min-h-[80px] py-3 justify-between bg-primary/10 dark:bg-primary/20 border-r-4 border-primary">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="relative shrink-0">
                                        <div className="bg-primary/10 dark:bg-primary/20 rounded-full size-14 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary dark:text-primary/80" style={{ fontSize: '32px' }}>
                                                person
                                            </span>
                                        </div>
                                        {isConnected && (
                                            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center overflow-hidden">
                                        <p className="text-gray-900 dark:text-white text-base font-bold leading-normal truncate">
                                            {opponentName}
                                        </p>
                                        <p className="text-sm font-medium leading-normal truncate text-primary dark:text-primary/90">
                                            {messages.length > 0
                                                ? messages[messages.length - 1].content.substring(0, 20) + (messages[messages.length - 1].content.length > 20 ? '...' : '')
                                                : '채팅을 시작해보세요'}
                                        </p>
                                    </div>
                                </div>
                                <div className="shrink-0 flex flex-col items-end gap-1">
                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">
                                        {messages.length > 0 ? messages[messages.length - 1].time : ''}
                                    </p>
                                </div>
                            </div>

                            {/* 다른 채팅방들 (백엔드 API 준비되면 여기에 추가) */}
                            <div className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
                                다른 채팅방이 없습니다
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="flex flex-1 flex-col bg-background-light dark:bg-background-dark">
                    {/* Chat Header */}
                    <header className="flex-shrink-0 flex items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/community"
                                className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                                    arrow_back
                                </span>
                            </Link>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 flex items-center justify-center bg-primary/10 dark:bg-primary/20">
                                <span className="material-symbols-outlined text-primary dark:text-primary/80">
                                    person
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{opponentName}</h2>
                                    {isConnected ? (
                                        <div className="flex items-center gap-1">
                                            <div className="size-2 bg-green-500 rounded-full" />
                                            <span className="text-xs text-green-600 dark:text-green-400">연결됨</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <div className="size-2 bg-gray-400 rounded-full" />
                                            <span className="text-xs text-gray-500">연결 중...</span>
                                        </div>
                                    )}
                                </div>
                                {postId && (
                                    <Link
                                        href={`/community/${postId}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        모집 글 보기
                                    </Link>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                <span className="material-symbols-outlined text-6xl mb-4">chat_bubble</span>
                                <p className="text-lg">채팅을 시작해보세요!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex items-end gap-3 max-w-xl ${msg.type === 'sent' ? 'ml-auto flex-row-reverse' : ''
                                        }`}
                                >
                                    {msg.type === 'received' && (
                                        <div className="bg-primary/10 dark:bg-primary/20 rounded-full size-8 shrink-0 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-sm">person</span>
                                        </div>
                                    )}
                                    <div className={`flex flex-col gap-1 ${msg.type === 'sent' ? 'items-end' : 'items-start'}`}>
                                        {msg.type === 'received' && msg.senderName && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
                                                {msg.senderName}
                                            </span>
                                        )}
                                        <div
                                            className={`p-3 rounded-lg shadow-sm ${msg.type === 'sent'
                                                ? 'bg-primary text-white rounded-br-none'
                                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap break-words">
                                                {msg.content}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 px-1">{msg.time}</span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <input
                                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg focus:ring-primary focus:border-primary text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder={isConnected ? "메시지를 입력하세요..." : "연결 중..."}
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={!isConnected}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!isConnected || !message.trim()}
                                className={`flex-shrink-0 size-11 flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isConnected && message.trim()
                                    ? 'bg-black dark:bg-primary text-white hover:bg-black/90 dark:hover:bg-primary/90 focus:ring-black dark:focus:ring-primary'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
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
