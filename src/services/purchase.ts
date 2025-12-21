import { api } from '@/lib/api';
import { Purchase } from '@/types';

export const purchaseService = {
  async purchaseCourse(courseId: string): Promise<Purchase> {
    return api.post<Purchase>('/purchases', { courseId });
  },

  async getMyPurchases(): Promise<Purchase[]> {
    return api.get<Purchase[]>('/purchases/my');
  },

  async isPurchased(courseId: string): Promise<boolean> {
    return api.get<boolean>(`/purchases/check/${courseId}`);
  },
};
