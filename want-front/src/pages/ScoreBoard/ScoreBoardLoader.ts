import axios from "axios";
import { getAuthToken } from "../Auth/Auth_utils";
import type { ScoreType } from "./ScoreBoard";

export async function loader() {
  const token = getAuthToken();

  try {
    const response = await axios.get<ScoreType>(
      `${import.meta.env.VITE_BACKEND_API}/review/scoreboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Response("Failed to load top explorer.", {
        status: error.response?.status ?? 500,
      });
    }
    throw new Response("Unknown error occurred", { status: 500 });
  }
}
