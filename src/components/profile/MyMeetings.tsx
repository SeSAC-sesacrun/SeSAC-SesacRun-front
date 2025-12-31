import React, { useState } from 'react';

interface Meeting {
    id: string;
    title: string;
    status: string;
    role: string;
}

interface MyMeetingsProps {
    meetings: Meeting[];
}

export default function MyMeetings({ meetings }: MyMeetingsProps) {
    const [meetingsFilter, setMeetingsFilter] = useState<'all' | 'organizer' | 'participant'>('all');

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">모임</h2>

            {/* Filter Buttons */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setMeetingsFilter('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${meetingsFilter === 'all'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-600 dark:text-gray-400'
                        }`}
                >
                    전체
                </button>
                <button
                    onClick={() => setMeetingsFilter('organizer')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${meetingsFilter === 'organizer'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-600 dark:text-gray-400'
                        }`}
                >
                    모집자
                </button>
                <button
                    onClick={() => setMeetingsFilter('participant')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${meetingsFilter === 'participant'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-600 dark:text-gray-400'
                        }`}
                >
                    참여자
                </button>
            </div>

            <div className="space-y-4">
                {meetings
                    .filter(meeting =>
                        meetingsFilter === 'all' || meeting.role === meetingsFilter
                    )
                    .map((meeting) => (
                        <div
                            key={meeting.id}
                            className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className={`text-xs px-2 py-1 rounded font-bold ${meeting.status === 'recruiting'
                                        ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                        : meeting.status === 'approved'
                                            ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {meeting.status === 'recruiting'
                                        ? '모집중'
                                        : meeting.status === 'approved'
                                            ? '참여 중'
                                            : '완료'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {meeting.role === 'organizer' ? '모집자' : '참여자'}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                {meeting.title}
                            </h3>
                        </div>
                    ))}
            </div>
        </div>
    );
}
