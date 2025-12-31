import React from 'react';

interface Purchase {
    id: string;
    courseTitle: string;
    price: number;
    purchasedAt: string;
    thumbnail: string;
}

interface MyPurchasesProps {
    purchases: Purchase[];
}

export default function MyPurchases({ purchases }: MyPurchasesProps) {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">구매 내역</h2>
            <div className="space-y-4">
                {purchases.map((purchase) => (
                    <div
                        key={purchase.id}
                        className="flex gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                    >
                        <div
                            className="w-32 h-20 bg-center bg-cover rounded-lg flex-shrink-0"
                            style={{ backgroundImage: `url('${purchase.thumbnail}')` }}
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                {purchase.courseTitle}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                구매일: {purchase.purchasedAt}
                            </p>
                            <p className="text-sm font-bold text-primary mt-2">
                                {purchase.price.toLocaleString()}원
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
