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

interface ChatRoom {
    roomId: number;
    postId?: number;
    opponentName: string;
    opponentId?: number;
    lastMessage?: string;
    lastMessageTime?: string;
}

export default function ChatPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const chatId = params.id as string;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isPostAuthor, setIsPostAuthor] = useState(false); // 모집 글 작성자 여부
    const [memberId, setMemberId] = useState<number | null>(null); // 참여자 memberId
    const [memberStatus, setMemberStatus] = useState<string | null>(null); // 참여 상태
    const stompClientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fetchedPostIds = useRef<Set<string>>(new Set()); // 이미 조회한 postId 추적

    // 현재 채팅방 정보 가져오기
    const currentRoom = chatRooms.find(room => room.roomId.toString() === chatId);
    const opponentName = currentRoom?.opponentName || '상대방';
    const postId = currentRoom?.postId?.toString() || null;

    // 모집 글 정보 및 참여 상태 조회
    useEffect(() => {
        const fetchPostAndMemberInfo = async () => {
            if (!postId) return;

            // 이미 조회한 postId면 스킵
            if (fetchedPostIds.current.has(postId)) {
                return;
            }

            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) return;

                // 1. 모집 글 정보 조회 (작성자 여부 확인)
                const postResponse = await fetch(`http://localhost:8080/api/recruitments/posts/${postId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (postResponse.ok) {
                    const postResult = await postResponse.json();
                    if (postResult.success && postResult.data) {
                        const isAuthor = postResult.data.author;
                        setIsPostAuthor(isAuthor);

                        // 조회 완료 표시
                        fetchedPostIds.current.add(postId);

                        // 2. 멤버 목록 조회 (작성자만 가능)
                        if (isAuthor) {
                            const membersResponse = await fetch(
                                `http://localhost:8080/api/recruitments/posts/${postId}/members`,
                                {
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                    },
                                }
                            );

                            if (membersResponse.ok) {
                                const membersResult = await membersResponse.json();
                                if (membersResult.success && membersResult.data) {
                                    console.log('📋 Members List:', membersResult.data);

                                    // 채팅방 목록에서 현재 채팅방의 opponentId 찾기
                                    const currentRoom = chatRooms.find(
                                        room => room.roomId.toString() === chatId
                                    );

                                    if (currentRoom?.opponentId) {
                                        // 멤버 목록에서 상대방 찾기
                                        const opponentMember = membersResult.data.find(
                                            (m: any) => m.userId === currentRoom.opponentId
                                        );

                                        if (opponentMember) {
                                            setMemberId(opponentMember.id);
                                            setMemberStatus(opponentMember.status);
                                            console.log('✅ Found opponent member:', {
                                                memberId: opponentMember.id,
                                                userId: opponentMember.userId,
                                                userName: opponentMember.userName,
                                                status: opponentMember.status
                                            });
                                        } else {
                                            console.log('ℹ️ 상대방이 아직 신청하지 않았습니다.');
                                        }
                                    } else {
                                        console.warn('⚠️ 채팅방 정보에 opponentId가 없습니다.');
                                    }
                                }
                            } else if (membersResponse.status === 403) {
                                console.warn('⚠️ 멤버 목록 조회 권한이 없습니다.');
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching post and member info:', error);
            }
        };

        fetchPostAndMemberInfo();
    }, [postId, chatId]); // chatRooms 제거

    // 채팅방 목록 불러오기
    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                if (!accessToken) {
                    return;
                }

                const response = await fetch('http://localhost:8080/api/chatrooms', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch chat rooms');
                }

                const result = await response.json();

                if (result.success && result.data) {
                    // 마지막 메시지 시간 기준으로 내림차순 정렬 (최신이 위로)
                    const sortedRooms = result.data.sort((a: ChatRoom, b: ChatRoom) => {
                        if (!a.lastMessageTime) return 1;
                        if (!b.lastMessageTime) return -1;
                        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
                    });
                    setChatRooms(sortedRooms);
                }
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
            }
        };

        // 초기 로드
        fetchChatRooms();

        // 10초마다 채팅방 목록 갱신 (다른 채팅방의 새 메시지 감지)
        const interval = setInterval(fetchChatRooms, 10000);

        return () => clearInterval(interval);
    }, []);

    // 기존 채팅 메시지 불러오기
    useEffect(() => {
        const fetchMessages = async () => {
            if (!chatId) return;

            try {
                const accessToken = localStorage.getItem('accessToken');

                if (!accessToken) {
                    return;
                }

                const response = await fetch(
                    `http://localhost:8080/api/chat/rooms/${chatId}/messages?page=0&size=50`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }

                const result = await response.json();

                if (result.success && result.data && result.data.content) {
                    // 사용자 ID를 JWT에서 추출
                    let currentUserId: number | null = null;
                    try {
                        const payload = JSON.parse(atob(accessToken.split('.')[1]));
                        currentUserId = payload.userId || payload.sub;
                    } catch (e) {
                        console.error('Failed to parse JWT:', e);
                    }

                    // 메시지를 ChatMessage 형식으로 변환
                    const loadedMessages: ChatMessage[] = result.data.content.map((msg: any) => {
                        const isMine = currentUserId && msg.senderId === currentUserId;
                        return {
                            type: isMine ? 'sent' : 'received',
                            content: msg.message,
                            time: new Date(msg.sendTime).toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            senderName: msg.senderName,
                        };
                    });

                    // 시간 순으로 정렬 (오래된 메시지가 위로)
                    setMessages(loadedMessages.reverse());
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [chatId]);

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

        // 사용자 ID를 JWT에서 추출
        let currentUserId: number | null = null;
        try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            console.log('🔍 JWT Payload:', payload);
            currentUserId = payload.userId || payload.sub;
            console.log('👤 Current User ID (from JWT):', currentUserId);
        } catch (e) {
            console.error('Failed to parse JWT:', e);
        }

        // STOMP 클라이언트 생성 (SockJS 사용)
        console.log('🔑 Access Token:', accessToken ? 'exists' : 'missing');
        console.log('🏠 Chat Room ID:', chatId);

        const client = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8080/ws-stomp?token=${accessToken}`),
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            debug: (str) => {
                console.log('📡 STOMP:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('✅ WebSocket Connected');
            setIsConnected(true);

            // 채팅방 구독
            const subscription = client.subscribe(`/sub/chat/room/${chatId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log('📩 Received:', receivedMessage);

                // senderId와 현재 사용자 ID 비교
                const isMine = currentUserId && receivedMessage.senderId === currentUserId;
                console.log('🔍 Is Mine?', {
                    currentUserId,
                    senderId: receivedMessage.senderId,
                    isMine,
                    comparison: `${currentUserId} === ${receivedMessage.senderId}`
                });

                // 메시지를 채팅 목록에 추가
                const newMessage: ChatMessage = {
                    type: isMine ? 'sent' : 'received',
                    content: receivedMessage.message,
                    time: new Date(receivedMessage.sendTime).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    senderName: receivedMessage.senderName,
                };

                setMessages((prev) => [...prev, newMessage]);
            });

            console.log('📬 Subscribed to:', `/sub/chat/room/${chatId}`);
        };

        client.onStompError = (frame) => {
            console.error('❌ STOMP Error:', frame);
            console.error('Error headers:', frame.headers);
            console.error('Error body:', frame.body);
            setIsConnected(false);

            if (frame.headers.message) {
                alert(`연결 실패: ${frame.headers.message}`);
            }
        };

        client.onWebSocketError = (event) => {
            console.error('❌ WebSocket Error:', event);
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

    // 모임 신청 (참여자)
    const handleApply = async () => {
        if (!postId) {
            alert('모집 글 정보가 없습니다.');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            // 디버깅: 요청 정보 출력
            console.log('📤 Apply Request:', {
                postId,
                hasToken: !!accessToken,
                url: `http://localhost:8080/api/recruitments/posts/${postId}/members`
            });

            const response = await fetch(`http://localhost:8080/api/recruitments/posts/${postId}/members`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            // 응답 body가 있는지 확인
            const text = await response.text();
            let result;

            try {
                result = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('❌ JSON Parse Error:', e);
                result = {};
            }

            console.log('📤 Apply Response:', { status: response.status, result });

            if (!response.ok) {
                // 백엔드 에러 메시지 표시
                let errorMsg = '신청에 실패했습니다.';

                if (response.status === 403) {
                    errorMsg = '권한이 없습니다. 자신의 모집 글에는 신청할 수 없습니다.';
                } else if (result.error?.message) {
                    errorMsg = result.error.message;
                } else if (result.message) {
                    errorMsg = result.message;
                }

                console.error('❌ Apply Failed:', errorMsg);
                alert(errorMsg);
                return;
            }

            if (result.success) {
                alert('모임 신청이 완료되었습니다!');
                // 상태 새로고침
                window.location.reload();
            } else {
                const errorMsg = result.error?.message || result.message || '신청에 실패했습니다.';
                console.error('❌ Apply Failed:', errorMsg);
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Error applying to recruitment:', error);
            alert('신청 중 오류가 발생했습니다.');
        }
    };

    // 모임 신청 승인 (모집자)
    const handleApprove = async () => {
        if (!postId || !memberId) {
            alert('필요한 정보가 없습니다.');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const response = await fetch(
                `http://localhost:8080/api/recruitments/posts/${postId}/members/${memberId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 'APPROVED' }),
                }
            );

            // 응답 body가 있는지 확인
            const text = await response.text();
            let result;

            try {
                result = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('❌ JSON Parse Error:', e);
                result = {};
            }

            console.log('📤 Approve Response:', { status: response.status, result });

            if (!response.ok) {
                let errorMsg = '승인에 실패했습니다.';

                if (response.status === 403) {
                    errorMsg = '권한이 없습니다.';
                } else if (response.status === 404) {
                    errorMsg = '신청 정보를 찾을 수 없습니다.';
                } else if (result.error?.message) {
                    errorMsg = result.error.message;
                } else if (result.message) {
                    errorMsg = result.message;
                }

                console.error('❌ Approve Failed:', errorMsg);
                alert(errorMsg);
                return;
            }

            if (result.success) {
                alert('참여를 승인했습니다!');
                setMemberStatus('APPROVED'); // 상태 업데이트
            } else {
                const errorMsg = result.error?.message || result.message || '승인에 실패했습니다.';
                console.error('❌ Approve Failed:', errorMsg);
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Error approving member:', error);
            alert('승인 중 오류가 발생했습니다.');
        }
    };

    // 모임 신청 거절 (모집자)
    const handleReject = async () => {
        if (!postId || !memberId) {
            alert('필요한 정보가 없습니다.');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const response = await fetch(
                `http://localhost:8080/api/recruitments/posts/${postId}/members/${memberId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 'REJECTED' }),
                }
            );

            // 응답 body가 있는지 확인
            const text = await response.text();
            let result;

            try {
                result = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('❌ JSON Parse Error:', e);
                result = {};
            }

            console.log('📤 Reject Response:', { status: response.status, result });

            if (!response.ok) {
                let errorMsg = '거절에 실패했습니다.';

                if (response.status === 403) {
                    errorMsg = '권한이 없습니다.';
                } else if (response.status === 404) {
                    errorMsg = '신청 정보를 찾을 수 없습니다.';
                } else if (result.error?.message) {
                    errorMsg = result.error.message;
                } else if (result.message) {
                    errorMsg = result.message;
                }

                console.error('❌ Reject Failed:', errorMsg);
                alert(errorMsg);
                return;
            }

            if (result.success) {
                alert('참여를 거절했습니다.');
                setMemberStatus('REJECTED'); // 상태 업데이트
            } else {
                const errorMsg = result.error?.message || result.message || '거절에 실패했습니다.';
                console.error('❌ Reject Failed:', errorMsg);
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Error rejecting member:', error);
            alert('거절 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Chat Room List */}
                <aside className="w-[360px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">채팅</h1>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col">
                            {chatRooms.length > 0 ? (
                                chatRooms.map((room) => {
                                    const isActive = room.roomId.toString() === chatId;

                                    return (
                                        <Link
                                            key={room.roomId}
                                            href={`/chat/${room.roomId}`}
                                            className={`flex items-center gap-4 px-4 min-h-[80px] py-3 justify-between ${isActive
                                                ? 'bg-primary/10 dark:bg-primary/20 border-r-4 border-primary'
                                                : 'border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="relative shrink-0">
                                                    <div className={`rounded-full size-14 flex items-center justify-center ${isActive
                                                        ? 'bg-primary/10 dark:bg-primary/20'
                                                        : 'bg-gray-100 dark:bg-gray-800'
                                                        }`}>
                                                        <span className={`material-symbols-outlined ${isActive
                                                            ? 'text-primary dark:text-primary/80'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                            }`} style={{ fontSize: '32px' }}>
                                                            person
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center overflow-hidden">
                                                    <p className="text-gray-900 dark:text-white text-base font-bold leading-normal truncate">
                                                        {room.opponentName}
                                                    </p>
                                                    <p className={`text-sm font-medium leading-normal truncate ${isActive
                                                        ? 'text-primary dark:text-primary/90'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                        {room.lastMessage || '채팅을 시작해보세요'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 flex flex-col items-end gap-1">
                                                {room.lastMessageTime && (
                                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">
                                                        {new Date(room.lastMessageTime).toLocaleTimeString('ko-KR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
                                    채팅방이 없습니다
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="flex flex-1 flex-col bg-background-light dark:bg-background-dark">
                    {/* Chat Header */}
                    <header className="flex-shrink-0 flex items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 flex items-center justify-center bg-primary/10 dark:bg-primary/20">
                                <span className="material-symbols-outlined text-primary dark:text-primary/80">
                                    person
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{opponentName}</h2>
                                {postId && (
                                    <Link
                                        href={`/community/${postId}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {isPostAuthor ? '내 모집글 보기' : '모집 글 보기'}
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Role-based Action Buttons */}
                        {postId && (
                            <div className="flex gap-2">
                                {isPostAuthor ? (
                                    // 모집자: 승인/거절 버튼 또는 상태 표시
                                    memberId ? (
                                        memberStatus === 'PENDING' ? (
                                            // 대기 중 → 승인/거절 버튼
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
                                        ) : memberStatus === 'APPROVED' ? (
                                            // 승인됨 → 상태 표시
                                            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                                <span className="font-bold">승인 완료</span>
                                            </div>
                                        ) : memberStatus === 'REJECTED' ? (
                                            // 거절됨 → 상태 표시
                                            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                                                <span className="material-symbols-outlined text-lg">cancel</span>
                                                <span className="font-bold">거절됨</span>
                                            </div>
                                        ) : null
                                    ) : (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <span className="material-symbols-outlined text-lg text-gray-400">info</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                상대방이 신청하면 승인/거절할 수 있습니다
                                            </span>
                                        </div>
                                    )
                                ) : (
                                    // 참여자: 신청하기 버튼
                                    <button
                                        onClick={handleApply}
                                        disabled={memberStatus !== null}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-black dark:text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        <span>
                                            {memberStatus === 'PENDING' && '승인 대기중'}
                                            {memberStatus === 'APPROVED' && '승인됨'}
                                            {memberStatus === 'REJECTED' && '거절됨'}
                                            {memberStatus === null && '신청하기'}
                                        </span>
                                    </button>
                                )}
                            </div>
                        )}
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
                                                ? 'bg-primary text-black dark:text-white rounded-br-none'
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
