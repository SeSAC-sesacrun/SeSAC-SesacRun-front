'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            title: '초보자를 위한 완벽한 웹 개발 마스터클래스',
            instructor: '김철수',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
            price: 129000,
            originalPrice: 258000,
            discount: 50,
        },
        {
            id: '2',
            title: 'UI/UX 디자인 기초',
            instructor: '윤아영',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
            price: 110000,
            originalPrice: 220000,
            discount: 50,
        },
    ]);

    const handleRemoveItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const totalOriginalPrice = cartItems.reduce((sum, item) => sum + item.originalPrice, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalDiscount = totalOriginalPrice - totalPrice;

    const handleCheckout = () => {
        alert('결제 페이지로 이동합니다!');
        // router.push('/checkout');
    };

    return (
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

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mb-6">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-600" style={{ fontSize: '80px' }}>
                                shopping_cart
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            장바구니가 비어있습니다
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
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
                                    key={item.id}
                                    className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 flex gap-4"
                                >
                                    <Link href={`/courses/${item.id}`} className="flex-shrink-0">
                                        <div
                                            className="w-40 h-24 bg-cover bg-center rounded-lg"
                                            style={{ backgroundImage: `url('${item.thumbnail}')` }}
                                        />
                                    </Link>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link href={`/courses/${item.id}`}>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 hover:text-primary">
                                                    {item.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {item.instructor}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    ₩{item.price.toLocaleString()}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                                    ₩{item.originalPrice.toLocaleString()}
                                                </span>
                                                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                                    {item.discount}% 할인
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
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
                                        <span>정가</span>
                                        <span>₩{totalOriginalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-red-600 dark:text-red-400 font-bold">
                                        <span>할인</span>
                                        <span>-₩{totalDiscount.toLocaleString()}</span>
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
                                    className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors mb-3"
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
    );
}
