"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";

import api from "@/lib/axios";

// PortOne SDK 타입 정의 (TypeScript 환경이므로)
declare global {
  interface Window {
    IMP?: any;
  }
}

// API 응답 데이터 타입 정의
interface CartItem {
  cartItemId: number;
  courseId: number;
  courseTitle: string;
  instructorName: string;
  thumbnail: string;
  price: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 장바구니 데이터 불러오기
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/carts");

        if (response.data && response.data.success) {
          const items = response.data.data;
          setCartItems(items);
          const calculatedTotalPrice = items.reduce(
            (sum: number, item: CartItem) => sum + item.price,
            0
          );
          setTotalPrice(calculatedTotalPrice);
        } else {
          setError(
            response.data.message || "장바구니 정보를 불러오는데 실패했습니다."
          );
          setCartItems([]);
          setTotalPrice(0);
        }
      } catch (err: any) {
        console.error("장바구니 정보 로드 실패:", err);
        // 401 (Unauthorized) 에러 처리
        if (err.response?.status === 401) {
          setError("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          // 잠시 후 로그인 페이지로 리디렉션
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          setError(
            err.response?.data?.message ||
              "장바구니 정보를 불러오는 중 오류가 발생했습니다."
          );
        }
        setCartItems([]);
        setTotalPrice(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [router]);

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      // 백엔드 API 호출하여 장바구니에서 항목 제거
      await api.delete(`/api/carts/${cartItemId}`);

      // API 호출 성공 시 프론트엔드 상태 업데이트
      const updatedCartItems = cartItems.filter(
        (item) => item.cartItemId !== cartItemId
      );
      setCartItems(updatedCartItems);
      setTotalPrice(
        (prev) =>
          prev -
          (cartItems.find((item) => item.cartItemId === cartItemId)?.price || 0)
      );
    } catch (error) {
      console.error("장바구니 항목 삭제 실패:", error);
      alert("장바구니에서 항목을 삭제하는 데 실패했습니다.");
    }
  };

  // 총 할인 및 원가 계산
  const totalOriginalPrice = totalPrice;
  const totalDiscount = 0;

  // 결제 검증 및 주문 처리를 위한 별도 함수
  const processPaymentVerification = async (rsp: any, currentRouter: any) => {
    try {
      // `fetch` 대신 `api.post` 사용
      const response = await api.post("/api/payments", rsp);

      // 백엔드에서 성공적인 응답을 받았을 때
      if (response.status === 200 || response.status === 201) {
        alert("결제가 성공적으로 완료되었습니다.");
        currentRouter.push("/profile");
      } else {
        // 성공적인 2xx 응답을 받았지만, 예상치 못한 상태 코드일 경우
        throw new Error(
          response.data.message ||
            "결제 처리 중 알 수 없는 오류가 발생했습니다."
        );
      }
    } catch (e: any) {
      // axios 에러 객체는 `e.response`에 서버 응답을 포함합니다.
      const errorMessage = e.response?.data?.message || (e as Error).message;
      alert(
        `결제는 성공했으나, 주문 처리 중 오류가 발생했습니다.\n관리자에게 문의해주세요: ${errorMessage}`
      );
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    try {
      const merchantUid = `order_${Date.now()}_${Math.floor(
        Math.random() * 1000
      )}`;

      if (totalPrice === 0) {
        const mockRspForFreeOrder: any = {
          success: true,
          imp_uid: `free_order_${merchantUid}`,
          pay_method: "free_payment",
          merchant_uid: merchantUid,
          name:
            cartItems.length > 0
              ? `${cartItems[0].courseTitle} 외 ${cartItems.length - 1}건`
              : "강의 결제",
          paid_amount: 0,
          currency: "KRW",
          pg_provider: "NONE",
          pg_type: "free",
          status: "paid",
          paid_at: Math.floor(Date.now() / 1000),
        };
        await processPaymentVerification(mockRspForFreeOrder, router);
      } else {
        const { IMP } = window;
        if (!IMP) {
          alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
          return;
        }

        const impCode = process.env.NEXT_PUBLIC_PORTONE_IMP_CODE;
        const pgProvider = process.env.NEXT_PUBLIC_PORTONE_PG_PROVIDER;

        if (!impCode || !pgProvider) {
          alert("결제 설정이 올바르지 않습니다. 관리자에게 문의해주세요.");
          return;
        }

        IMP.init(impCode);
        IMP.request_pay(
          {
            pg: pgProvider,
            pay_method: "card",
            merchant_uid: merchantUid,
            name:
              cartItems.length > 0
                ? `${cartItems[0].courseTitle} 외 ${cartItems.length - 1}건`
                : "강의 결제",
            amount: totalPrice,
            // todo : 사용자 정보 추가
            buyer_email: "test@test.com",
          },
          async (rsp: any) => {
            if (rsp.success) {
              await processPaymentVerification(rsp, router);
            } else {
              alert(`결제에 실패했습니다. 에러: ${rsp.error_msg}`);
            }
          }
        );
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert((error as Error).message);
    }
  };

  console.log("Rendering with cartItems:", cartItems);

  return (
    <>
      <Script src="https://cdn.iamport.kr/v1/iamport.js" />
      <main className="flex-1 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              장바구니
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {cartItems.length}개의 강의가 담겨있습니다
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p>장바구니 정보를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              <p>{error}</p>
              <p>잠시 후 다시 시도해주세요.</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <span
                  className="material-symbols-outlined text-gray-400 dark:text-gray-600"
                  style={{ fontSize: "80px" }}
                >
                  shopping_cart
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                장바구니가 비어있습니다
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
                관심있는 강의를 장바구니에 담아보세요
              </p>
              <Link
                href="/courses"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
              >
                강의 둘러보기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 flex gap-4"
                  >
                    <Link
                      href={`/courses/${item.courseId}`}
                      className="flex-shrink-0"
                    >
                      <div
                        className="w-40 h-24 bg-cover bg-center rounded-lg"
                        style={{ backgroundImage: `url('${item.thumbnail}')` }}
                      />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/courses/${item.courseId}`}>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1 hover:text-primary">
                            {item.courseTitle}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.instructorName}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ₩{item.price.toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.cartItemId)}
                          className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    주문 요약
                  </h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>총 상품 금액</span>
                      <span>₩{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                        <span>총 결제금액</span>
                        <span>₩{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="block w-full text-center border-2 border-primary bg-white dark:bg-gray-900 text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors mb-3"
                  >
                    결제하기
                  </button>
                  <Link
                    href="/courses"
                    className="block w-full text-center border-2 border-primary bg-white dark:bg-gray-900 text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                  >
                    쇼핑 계속하기
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
