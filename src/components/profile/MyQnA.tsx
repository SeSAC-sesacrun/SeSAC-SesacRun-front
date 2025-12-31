import React from 'react';

interface QnA {
    id: string;
    courseTitle: string;
    question: string;
    answered: boolean;
    createdAt: string;
}

interface MyQnAProps {
    qnaList: QnA[];
}

export default function MyQnA({ qnaList }: MyQnAProps) {
    return (
        <div className="space-y-4">
            {qnaList.map((qna) => (
                <div
                    key={qna.id}
                    className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                >
                    <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {qna.courseTitle}
                        </span>
                        <span
                            className={`text-xs px-2 py-1 rounded ${qna.answered
                                ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            {qna.answered ? '답변 완료' : '대기 중'}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {qna.question}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {qna.createdAt}
                    </p>
                </div>
            ))}
        </div>
    );
}
