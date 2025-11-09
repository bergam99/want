import axios from "axios";

import { create } from "zustand";

export type ReviewType = {
  id?: number;
  osmId: number;
  userEmail?: string;
  userId?: number;
  comment: string;
  rating: number;
  amenity: string;
  timeStamp: string;
  likeCount: number;
};

export type ReviewsType = ReviewType[];

type ReviewStoreType = {
  reviews: ReviewsType;
  isLoading: boolean;
  getReviewsByOsmId: (
    osmId: number,
    token: string | null
  ) => Promise<{ isSuccess: boolean; message?: string }>;
  submitReview: (
    newReview: Partial<ReviewType>,
    token: string | null
  ) => Promise<{ isSuccess: boolean; message?: string }>;
  toggleLike: (reviewId: number, token: string | null) => Promise<void>;
  editReview: (
    newReview: Partial<ReviewType>,
    token: string | null
  ) => Promise<{ isSuccess: boolean; message?: string }>;
  deleteReview: (token: string, id?: number) => Promise<{ isSuccess: boolean }>;
  editingReview: ReviewType | null;
  setEditingReview: (review: ReviewType | null) => void;
  isWriteMode: boolean;
  setIsWriteMode: (flag: boolean) => void;
};

export const useReviewsStore = create<ReviewStoreType>((set) => ({
  isLoading: true,
  reviews: [],
  editingReview: null,
  setEditingReview: (review) => set({ editingReview: review }),
  isWriteMode: false,
  setIsWriteMode: (flag) => set({ isWriteMode: flag }),

  /**
   * getReviewsByOsmId
   */
  getReviewsByOsmId: async (osmId, token) => {
    set({ isLoading: true });
    try {
      const response = await axios.get<ReviewType[]>(
        `${import.meta.env.VITE_BACKEND_API}/review/read/${osmId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ reviews: response.data });

      return { isSuccess: true };
    } catch (err: any) {
      set({ reviews: [] });

      if (err.status === 401) {
        return {
          isSuccess: false,
          message: "You need to be logged in to view the reviews.",
        };
      } else {
        return {
          isSuccess: false,
          message: "⚠ Something went wrong.",
        };
      }
    } finally {
      set({ isLoading: false });
    }
  },

  // TODO: max char 300 -> 1000 (comment dans db) et afficher dans front
  submitReview: async (newReview, token) => {
    set({ isLoading: true });
    try {
      const res = await axios.post<ReviewType>(
        `${import.meta.env.VITE_BACKEND_API}/review/create`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((prev) => ({
        reviews: [res.data, ...prev.reviews],
      }));
      return {
        isSuccess: true,
        message:
          "Your review has been submitted successfully. Thank you for your contribution !",
      };
    } catch (err: any) {
      return { isSuccess: false, message: `⚠ Error ${err.status}` };
    } finally {
      set({ isLoading: false });
    }
  },

  toggleLike: async (reviewId, token) => {
    if (!reviewId) return;
    set({ isLoading: true });
    try {
      const response = await axios.post<ReviewType>(
        `${import.meta.env.VITE_BACKEND_API}/review/like/${reviewId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedReview = response.data;

      set((state) => ({
        reviews: state.reviews.map((r) =>
          r.id === updatedReview.id ? updatedReview : r
        ),
      }));
    } catch (err) {
      console.error(err);
    }
    set({ isLoading: false });
  },

  editReview: async (review, token) => {
    set({ isLoading: true });
    try {
      const res = await axios.put<ReviewType>(
        `${import.meta.env.VITE_BACKEND_API}/review/edit`,
        review,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data;
      set((state) => ({
        reviews: state.reviews.map((r) => (r.id === updated.id ? updated : r)),
      }));
      return { isSuccess: true };
    } catch {
      return { isSuccess: false, message: "⚠ Update failed" };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteReview: async (token, id) => {
    if (!id) return { isSuccess: false };
    set({ isLoading: true });

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/review/delete/${id}`,

        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== id),
      }));
      return { isSuccess: true };
    } catch (err) {
      console.error("Delete failed:", err);
      return { isSuccess: false };
    } finally {
      set({ isLoading: false });
    }
  },
}));
