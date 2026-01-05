"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

// 타입 정의 (백엔드 명세 및 실제 응답 기반)
interface OrderItem {
    id: number;
    orderId: number;
    courseId: number;
    courseName: string;
    price: number;
    thumbnail?: string;
    createdAt: string;
}

interface Payment {
    id: number;
    paymentId: string;
    orderId: number;
    amount: number;
    status: string;
    pgProvider: string | null;
    portoneData: object | null;
    createdAt: string;
    updatedAt: string;
}

interface OrderDetails {
    id: number;
    orderNumber: string;
    userId: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
    payment: Payment;
}

export default function PurchaseDetailPage() {
    const params = useParams();
    const orderId = params.orderId;
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetail = React.useCallback(async () => {
        if (!orderId) return;
        try {
            setLoading(true);
            const response = await api.get(`/api/orders/${orderId}`);
            if (response.data && response.data.success) {
                setOrder(response.data.data);
            } else {
                setError(response.data.message || '주문 정보를 불러오는데 실패했습니다.');
            }
        } catch (err: any) {
            console.error('주문 상세 정보 로드 실패:', err);
            setError(err.response?.data?.message || '주문 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);

    // 구매일로부터 1일이 지났는지 확인하는 헬퍼 함수
    const isCancellationPeriodExpired = (createdAt: string) => {
        const purchaseDate = new Date(createdAt);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // 1일(밀리초)

        // 구매일로부터 1일이 지났는지 확인
        return (now.getTime() - purchaseDate.getTime()) > oneDay;
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        if (confirm("정말로 이 주문을 취소하시겠습니까? 환불 절차가 진행됩니다.")) {
            try {
                setLoading(true); // 취소 처리 중 로딩 상태 표시
                let response;
                // 금액에 따라 다른 API 호출
                if (order.totalAmount > 0) {
                    // 유료 주문 취소 (환불)
                    response = await api.post('/api/payments/cancel', {
                        orderId: order.id,
                        reason: '사용자 주문 취소'
                    });
                } else {
                    // 무료 주문 취소
                    response = await api.post(`/api/orders/${order.id}/cancel-free`);
                }

                if (response.data && response.data.success) {
                    alert("주문이 성공적으로 취소되었습니다.");
                    await fetchOrderDetail(); // 주문 정보 다시 불러오기
                } else {
                    throw new Error(response.data.message || "주문 취소에 실패했습니다.");
                }

            } catch (err: any) {
                console.error('주문 취소 실패:', err);
                alert(err.response?.data?.error?.message || err.message || "주문 취소 중 오류가 발생했습니다.");
            }
            finally {
                setLoading(false);
            }
        }
    };

  
      if (loading) {
          return (
              <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="text-center">
                      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                          주문 정보를 불러오는 중...
                      </p>
                  </div>
              </div>
          );
      }
  
      if (error || !order) {
          return (
              <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="text-center">
                      <p className="text-red-600 dark:text-red-400 mb-4">
                          {error || "주문 정보를 찾을 수 없습니다."}
                      </p>
                      <Link
                          href="/profile?tab=purchases"
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                          구매 내역으로 돌아가기
                      </Link>
                  </div>
              </div>
          );
      }
  
      return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                          결제 상세 내역
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          주문 번호: {order.orderNumber}
                      </p>
                  </div>
  
                  <div className="p-6 space-y-8">
                      {/* 주문 정보 */}
                      <div className="flex justify-between items-start">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                              <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">주문일</p>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                      {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                                  </p>
                              </div>
                              <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                      주문 상태
                                  </p>
                                  {(() => {
                                      let statusText = "";
                                      let statusColorClass = "";
                                      switch (order.status) {
                                          case "CREATED":
                                              statusText = "주문 생성 (결제 대기 중)";
                                              statusColorClass =
                                                  "text-yellow-600 bg-yellow-100 dark:bg-yellow-500/20";
                                              break;
                                          case "COMPLETED":
                                              statusText = "결제 완료";
                                              statusColorClass =
                                                  "text-green-600 bg-green-100 dark:bg-green-500/20";
                                              break;
                                          case "REFUND":
                                              statusText = "환불 완료";
                                              statusColorClass =
                                                  "text-red-600 bg-red-100 dark:bg-red-500/20";
                                              break;
                                          default:
                                              statusText = "알 수 없는 상태";
                                              statusColorClass =
                                                  "text-gray-600 bg-gray-100 dark:bg-gray-700";
                                              break;
                                      }
                                      return (
                                          <span
                                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColorClass}`}
                                          >
                                              {statusText}
                                          </span>
                                      );
                                  })()}
                              </div>
                              <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                      총 결제 금액
                                  </p>
                                  <p className="font-medium text-primary">
                                      {order.totalAmount.toLocaleString()}원
                                  </p>
                              </div>
                          </div>
                          {/* 주문 취소 버튼 추가 */}
                          {order.status === 'COMPLETED' && !isCancellationPeriodExpired(order.createdAt) && (
                              <div className="shrink-0">
                                  <button
                                      onClick={handleCancelOrder}
                                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                                  >
                                      주문 취소
                                  </button>
                              </div>
                          )}
                      </div>
  
          {/* 주문 상품 목록 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              주문 상품
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.courseId}
                  className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <Link href={`/courses/${item.courseId}`}>
                    <div
                      className="w-32 h-20 bg-center bg-cover rounded-lg flex-shrink-0"
                      style={{
                        backgroundImage: `url('${
                          item.thumbnail || "/placeholder.jpg"
                        }')`,
                      }}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/courses/${item.courseId}`}>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 hover:text-primary">
                        {item.courseName}
                      </h3>
                    </Link>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {item.price.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 정보 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              결제 정보
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  결제 금액
                </dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {order.payment.amount.toLocaleString()}원
                </dd>

                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  결제 상태
                </dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {(() => {
                    let paymentStatusText = "";
                    let paymentStatusColorClass = "";
                    switch (order.payment.status) {
                      case "READY":
                        paymentStatusText = "결제 대기 중";
                        paymentStatusColorClass =
                          "text-yellow-600 bg-yellow-100 dark:bg-yellow-500/20";
                        break;
                      case "COMPLETED":
                        paymentStatusText = "결제 완료";
                        paymentStatusColorClass =
                          "text-green-600 bg-green-100 dark:bg-green-500/20";
                        break;
                      case "FAILED":
                        paymentStatusText = "결제 실패";
                        paymentStatusColorClass =
                          "text-red-600 bg-red-100 dark:bg-red-500/20";
                        break;
                      default:
                        paymentStatusText = "알 수 없는 상태";
                        paymentStatusColorClass =
                          "text-gray-600 bg-gray-100 dark:bg-gray-700";
                        break;
                    }
                    return (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColorClass}`}
                      >
                        {paymentStatusText}
                      </span>
                    );
                  })()}
                </dd>

                {order.payment.pgProvider && (
                  <>
                    <dt className="text-sm text-gray-600 dark:text-gray-400">
                      결제 수단
                    </dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.payment.pgProvider}
                    </dd>
                  </>
                )}
                {order.payment.paidAt && (
                  <>
                    <dt className="text-sm text-gray-600 dark:text-gray-400">
                      결제일
                    </dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(order.payment.paidAt).toLocaleString("ko-KR")}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
