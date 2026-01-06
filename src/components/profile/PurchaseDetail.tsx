"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import Link from "next/link";

interface OrderDetailItem {
  id: number;
  orderId: number;
  courseId: number;
  courseName: string;
  price: number;
  thumbnail: string;
  createdAt: string;
}

interface OrderDetailResponse {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderDetailItem[];
  payment: {
    id: number;
    paymentId: string;
    orderId: number;
    amount: number;
    status: string;
    pgProvider: string | null;
    portoneData: any;
    createdAt: string;
    updatedAt: string;
  };
}

interface PurchaseDetailProps {
  orderId: number;
  onBackToList: () => void;
  onActionSuccess: () => void;
}

export default function PurchaseDetail({
  orderId,
  onBackToList,
  onActionSuccess,
}: PurchaseDetailProps) {
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      if (response.data.success) {
        setOrderDetail(response.data.data);
      } else {
        setError(
          response.data.message || "주문 상세 정보를 불러오는데 실패했습니다."
        );
      }
    } catch (err: any) {
      console.error("Failed to fetch order detail:", err);
      setError(
        err.response?.data?.message ||
          "주문 상세 정보를 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const isCancellationPeriodExpired = (createdAt: string) => {
    const purchaseDate = new Date(createdAt);
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    return now.getTime() - purchaseDate.getTime() > oneDay;
  };

  const handleRefundRequest = async () => {
    if (!orderDetail) return;
    setIsModalOpen(true);
  };

  const handleRefundSubmit = async () => {
    if (!orderDetail) return;

    // 사유 입력은 유료/무료 공통으로 요구하여 UI 흐름을 통일
    if (!refundReason.trim()) {
      alert("취소 사유를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      let response;
      response = await api.post("/api/refunds", {
        orderId: orderDetail.id,
        reason: refundReason,
      });

      if (response.data && response.data.success) {
        alert("주문이 성공적으로 취소되었습니다.");
        setIsModalOpen(false);
        setRefundReason("");
        onActionSuccess(); // Call the parent's refresh function
      } else {
        throw new Error(response.data.message || "주문 취소에 실패했습니다.");
      }
    } catch (err: any) {
      alert(
        err.response?.data?.error?.message ||
          err.message ||
          "주문 취소 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            주문 상세 정보를 불러오는 중...
          </p>
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
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            주문 상세 내역
          </h2>
          <button
            onClick={onBackToList}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            <span>목록으로</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  주문번호
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {orderDetail.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  주문일
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {new Date(orderDetail.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  결제 상태
                </p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    orderDetail.status === "COMPLETED"
                      ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                      : orderDetail.status === "REFUND"
                      ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {orderDetail.status === "COMPLETED"
                    ? "결제 완료"
                    : orderDetail.status === "REFUND"
                    ? "결제 취소"
                    : orderDetail.status === "CREATED"
                    ? "결제 대기중"
                    : "알 수 없음"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  총 결제 금액
                </p>
                <p className="text-xl font-bold text-primary">
                  {orderDetail.totalAmount.toLocaleString()}원
                </p>
              </div>
            </div>
            {orderDetail.status === "COMPLETED" &&
              !isCancellationPeriodExpired(orderDetail.createdAt) && (
                <div className="shrink-0">
                  <button
                    onClick={handleRefundRequest}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    주문 취소
                  </button>
                </div>
              )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            주문 상품
          </h3>
          <div className="space-y-4">
            {orderDetail.orderItems.map((item) => (
              <Link
                key={item.courseId}
                href={`/courses/${item.courseId}`}
                className="group block"
              >
                <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div
                    className="w-20 h-20 bg-center bg-cover rounded-lg shrink-0"
                    style={{
                      backgroundImage: `url('${
                        item.thumbnail ||
                        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
                      }')`,
                    }}
                  ></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                      {item.courseName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.price.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              환불 사유 입력
            </h2>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="환불 사유를 입력해주세요. (예: 단순 변심)"
              className="w-full h-28 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-primary focus:border-primary"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleRefundSubmit}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
