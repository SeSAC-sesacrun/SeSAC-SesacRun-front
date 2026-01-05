'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface OrderDetailItem {
    id: number; // 새로 추가된 id 필드 (백엔드 응답에 포함되어 있음)
    orderId: number; // 새로 추가된 orderId 필드
    courseId: number;
    courseName: string; // courseTitle -> courseName 변경
    price: number;
    thumbnail: string; // thumbnail 필드 추가
    createdAt: string; // createdAt 필드 추가
}

interface OrderDetailResponse {
    id: number; // OrderDetailResponse의 id 필드 (백엔드 응답에 포함되어 있음)
    orderNumber: string;
    userId: number; // userId 필드 추가
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string; // updatedAt 필드 추가
    orderItems: OrderDetailItem[];
    payment: { // payment 필드 추가 (필요에 따라 더 상세하게 정의 가능)
        id: number;
        paymentId: string;
        orderId: number;
        amount: number;
        status: string;
        pgProvider: string | null;
        portoneData: any; // 필요에 따라 상세하게 정의
        createdAt: string;
        updatedAt: string;
    };
}

interface PurchaseDetailProps {
    orderId: number;
    onBackToList: () => void;
}

export default function PurchaseDetail({ orderId, onBackToList }: PurchaseDetailProps) {
    const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // API endpoint를 /api/orders/${orderId}로 변경
                const response = await api.get(`/api/orders/${orderId}`);
                if (response.data.success) {
                    setOrderDetail(response.data.data);
                } else {
                    setError(response.data.message || '주문 상세 정보를 불러오는데 실패했습니다.');
                }
            } catch (err: any) {
                console.error('Failed to fetch order detail:', err);
                setError(err.response?.data?.message || '주문 상세 정보를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">주문 상세 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                    onClick={onBackToList}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    if (!orderDetail) {
        return (
            <div className="text-center py-8 text-gray-500">
                주문 상세 정보를 찾을 수 없습니다.
                <button
                    onClick={onBackToList}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">주문 상세 내역</h2>
                <button
                    onClick={onBackToList}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    <span>목록으로</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">주문번호</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white">{orderDetail.orderNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">주문일</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white">{new Date(orderDetail.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">결제 상태</p>
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                            orderDetail.status === 'COMPLETED' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                            orderDetail.status === 'REFUND' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                            'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' // CREATED 또는 기타 상태
                        }`}>
                            {
                                orderDetail.status === 'COMPLETED' ? '결제 완료' :
                                orderDetail.status === 'REFUND' ? '환불됨' :
                                orderDetail.status === 'CREATED' ? '결제 대기중' :
                                '알 수 없음' // 예상치 못한 상태
                            }
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">총 결제 금액</p>
                        <p className="text-xl font-bold text-primary">{orderDetail.totalAmount.toLocaleString()}원</p>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">주문 상품</h3>
                <div className="space-y-4">
                    {orderDetail.orderItems.map((item) => (
                        <div key={item.courseId} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div
                                className="w-20 h-20 bg-center bg-cover rounded-lg shrink-0"
                                style={{ backgroundImage: `url('${item.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"}')` }}
                            ></div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white line-clamp-2">{item.courseName}</p> {/* item.courseTitle -> item.courseName */}
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.price.toLocaleString()}원</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}