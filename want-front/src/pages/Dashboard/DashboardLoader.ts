import axios from "axios";
import { getAuthToken } from "../Auth/Auth_utils";
import type { ReviewsType } from "../../store/reviews";

export async function loader() {
  const token = getAuthToken();
  try {
    const response = await axios.get<ReviewsType>(
      `${import.meta.env.VITE_BACKEND_API}/review/my-reviews`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // console.error("Failed to fetch my reviews:", error);

    if (axios.isAxiosError(error)) {
      throw new Response("Failed to load my reviews.", {
        status: error.response?.status ?? 500,
      });
    }

    throw new Response("Unknown error occurred", { status: 500 });
  }
}
